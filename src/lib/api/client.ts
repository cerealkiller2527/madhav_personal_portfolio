import {
  APIResponse,
  APIClientConfig,
  RequestConfig,
  HTTPMethod,
  HTTPStatusCode,
  APIClientError,
  NetworkError,
  TimeoutError,
  ValidationError,
  RetryConfig
} from "@/types/apiTypes"

// Type-safe API Client
export class APIClient {
  private config: APIClientConfig

  constructor(config: Partial<APIClientConfig> = {}) {
    this.config = {
      baseURL: config.baseURL || "",
      timeout: config.timeout || 10000,
      retryConfig: {
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        backoffFactor: 2,
        ...config.retryConfig
      },
      defaultHeaders: {
        "Content-Type": "application/json",
        ...config.defaultHeaders
      }
    }
  }

  // Generic request method
  async request<T>(
    endpoint: string,
    config: Partial<RequestConfig> = {}
  ): Promise<APIResponse<T>> {
    const requestConfig: RequestConfig = {
      method: HTTPMethod.GET,
      headers: { ...this.config.defaultHeaders },
      timeout: this.config.timeout,
      retries: this.config.retryConfig.maxRetries,
      ...config,
      headers: { ...this.config.defaultHeaders, ...config.headers }
    }

    return this.executeWithRetry<T>(endpoint, requestConfig)
  }

  // HTTP method shortcuts
  async get<T>(endpoint: string, config?: Partial<RequestConfig>): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: HTTPMethod.GET })
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: Partial<RequestConfig>
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: HTTPMethod.POST, body })
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: Partial<RequestConfig>
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: HTTPMethod.PUT, body })
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: Partial<RequestConfig>
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: HTTPMethod.PATCH, body })
  }

  async delete<T>(endpoint: string, config?: Partial<RequestConfig>): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: HTTPMethod.DELETE })
  }

  // Execute request with retry logic
  private async executeWithRetry<T>(
    endpoint: string,
    config: RequestConfig
  ): Promise<APIResponse<T>> {
    let lastError: Error

    for (let attempt = 0; attempt <= (config.retries || 0); attempt++) {
      try {
        return await this.executeRequest<T>(endpoint, config)
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        const isLastAttempt = attempt === (config.retries || 0)
        const shouldRetry = this.shouldRetryRequest(lastError, attempt)

        if (isLastAttempt || !shouldRetry) {
          throw lastError
        }

        // Wait before retry with exponential backoff
        const delay = Math.min(
          this.config.retryConfig.baseDelay * Math.pow(this.config.retryConfig.backoffFactor, attempt),
          this.config.retryConfig.maxDelay
        )
        await this.delay(delay)
      }
    }

    throw lastError!
  }

  // Execute single request
  private async executeRequest<T>(
    endpoint: string,
    config: RequestConfig
  ): Promise<APIResponse<T>> {
    const url = this.buildURL(endpoint)
    const controller = new AbortController()
    
    // Set timeout
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, config.timeout || this.config.timeout)

    try {
      const response = await fetch(url, {
        method: config.method,
        headers: config.headers as HeadersInit,
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new APIClientError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status as HTTPStatusCode,
          await this.safelyParseResponse(response)
        )
      }

      const data = await this.safelyParseResponse<T>(response)
      
      return {
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: response.headers.get("x-request-id") || undefined
        }
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error && error.name === "AbortError") {
        throw new TimeoutError(config.timeout || this.config.timeout)
      }

      if (error instanceof APIClientError) {
        throw error
      }

      throw new NetworkError(
        `Network request failed: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined
      )
    }
  }

  // Build full URL
  private buildURL(endpoint: string): string {
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      return endpoint
    }

    const baseURL = this.config.baseURL.endsWith("/") 
      ? this.config.baseURL.slice(0, -1) 
      : this.config.baseURL
    
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    
    return `${baseURL}${cleanEndpoint}`
  }

  // Safely parse response
  private async safelyParseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type")
    
    if (contentType?.includes("application/json")) {
      try {
        return await response.json()
      } catch (error) {
        throw new APIClientError(
          "Failed to parse JSON response",
          response.status as HTTPStatusCode,
          await response.text()
        )
      }
    }

    return (await response.text()) as unknown as T
  }

  // Determine if request should be retried
  private shouldRetryRequest(error: Error, attempt: number): boolean {
    // Don't retry client errors (4xx)
    if (error instanceof APIClientError && error.statusCode) {
      const statusCode = error.statusCode
      return statusCode >= 500 || statusCode === HTTPStatusCode.TOO_MANY_REQUESTS
    }

    // Retry network errors and timeouts
    return error instanceof NetworkError || error instanceof TimeoutError
  }

  // Utility delay function
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Update configuration
  updateConfig(config: Partial<APIClientConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      retryConfig: {
        ...this.config.retryConfig,
        ...config.retryConfig
      },
      defaultHeaders: {
        ...this.config.defaultHeaders,
        ...config.defaultHeaders
      }
    }
  }
}

// Default client instance
export const apiClient = new APIClient()

// Specialized clients
export const notionAPIClient = new APIClient({
  baseURL: "https://api.notion.com/v1",
  defaultHeaders: {
    "Notion-Version": "2022-06-28"
  }
})

// Type-safe wrapper functions
export async function safeAPICall<T>(
  apiCall: () => Promise<APIResponse<T>>,
  fallback?: T
): Promise<T | undefined> {
  try {
    const response = await apiCall()
    return response.success ? response.data : fallback
  } catch (error) {
    console.error("API call failed:", error)
    return fallback
  }
}

export function createTypedClient<TSchema extends Record<string, unknown>>(
  baseConfig?: Partial<APIClientConfig>
) {
  return new APIClient(baseConfig) as APIClient & {
    get<K extends keyof TSchema>(endpoint: string): Promise<APIResponse<TSchema[K]>>
    post<K extends keyof TSchema>(endpoint: string, body?: unknown): Promise<APIResponse<TSchema[K]>>
    put<K extends keyof TSchema>(endpoint: string, body?: unknown): Promise<APIResponse<TSchema[K]>>
    patch<K extends keyof TSchema>(endpoint: string, body?: unknown): Promise<APIResponse<TSchema[K]>>
    delete<K extends keyof TSchema>(endpoint: string): Promise<APIResponse<TSchema[K]>>
  }
}