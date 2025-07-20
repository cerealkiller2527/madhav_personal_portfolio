import { BlogError, BlogErrorCode } from "@/types/blogTypes"
import { NotionError } from "@/types/notionTypes"
import { APIClientError, NetworkError, TimeoutError } from "@/types/apiTypes"

// =============================================================================
// SERVER-SIDE ERROR HANDLERS (No React dependencies)
// =============================================================================

// Server-side Error Handler (no React dependencies)
export class ServerErrorHandler {
  private static instance: ServerErrorHandler
  private errorListeners: Array<(error: Error) => void> = []

  private constructor() {}

  static getInstance(): ServerErrorHandler {
    if (!ServerErrorHandler.instance) {
      ServerErrorHandler.instance = new ServerErrorHandler()
    }
    return ServerErrorHandler.instance
  }

  addErrorListener(listener: (error: Error) => void): void {
    this.errorListeners.push(listener)
  }

  removeErrorListener(listener: (error: Error) => void): void {
    this.errorListeners = this.errorListeners.filter(l => l !== listener)
  }

  handleError(error: Error, context?: string): void {
    const enhancedError = this.enhanceError(error, context)
    
    // Log error
    console.error("Error occurred:", enhancedError)
    
    // Notify listeners
    this.errorListeners.forEach(listener => {
      try {
        listener(enhancedError)
      } catch (listenerError) {
        console.error("Error in error listener:", listenerError)
      }
    })

    // Report to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      this.reportError(enhancedError, context)
    }
  }

  private enhanceError(error: Error, context?: string): Error {
    if (context) {
      error.message = `[${context}] ${error.message}`
    }
    
    // Add timestamp
    if (!error.stack?.includes("timestamp:")) {
      error.stack = `timestamp: ${new Date().toISOString()}\n${error.stack}`
    }

    return error
  }

  private reportError(error: Error, context?: string): void {
    // Implement error reporting logic here
    // Could send to Sentry, LogRocket, etc.
    console.warn("Error reporting not implemented:", { error, context })
  }
}

// =============================================================================
// BLOG ERROR HANDLERS
// =============================================================================

export class BlogErrorHandler {
  static handleBlogError(error: unknown, operation: string): BlogError {
    if (error instanceof BlogError) {
      return error
    }

    if (error instanceof NotionError) {
      return new BlogError(
        `Blog operation failed: ${error.message}`,
        BlogErrorCode.NETWORK_ERROR,
        undefined,
        error
      )
    }

    if (error instanceof NetworkError) {
      return new BlogError(
        `Network error during ${operation}: ${error.message}`,
        BlogErrorCode.NETWORK_ERROR,
        undefined,
        error
      )
    }

    if (error instanceof Error) {
      return new BlogError(
        `Unexpected error during ${operation}: ${error.message}`,
        BlogErrorCode.UNKNOWN_ERROR,
        undefined,
        error
      )
    }

    return new BlogError(
      `Unknown error during ${operation}`,
      BlogErrorCode.UNKNOWN_ERROR
    )
  }

  static isRetryableError(error: BlogError): boolean {
    return [
      BlogErrorCode.NETWORK_ERROR,
      BlogErrorCode.CACHE_ERROR
    ].includes(error.code)
  }

  static getErrorMessage(error: BlogError): string {
    switch (error.code) {
      case BlogErrorCode.NOT_FOUND:
        return "The requested blog post could not be found."
      case BlogErrorCode.NETWORK_ERROR:
        return "Unable to connect to the blog service. Please try again later."
      case BlogErrorCode.CONFIGURATION_ERROR:
        return "Blog service is not properly configured."
      case BlogErrorCode.VALIDATION_ERROR:
        return "Invalid blog post data received."
      case BlogErrorCode.CACHE_ERROR:
        return "Cache error occurred. Data may be stale."
      case BlogErrorCode.TRANSFORM_ERROR:
        return "Error processing blog post content."
      default:
        return "An unexpected error occurred."
    }
  }
}

// =============================================================================
// SERVER-SIDE ERROR HANDLING UTILITIES
// =============================================================================

// Server-side async error wrapper
export async function withServerErrorHandling<T>(
  operation: () => Promise<T>,
  context: string,
  retryOptions?: {
    maxRetries: number
    baseDelay: number
    shouldRetry?: (error: Error) => boolean
  }
): Promise<T> {
  const { maxRetries = 0, baseDelay = 1000, shouldRetry } = retryOptions || {}
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      const isLastAttempt = attempt === maxRetries
      const shouldAttemptRetry = shouldRetry ? shouldRetry(lastError) : true

      if (isLastAttempt || !shouldAttemptRetry) {
        ServerErrorHandler.getInstance().handleError(lastError, context)
        throw lastError
      }

      // Wait before retry with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

// Server-safe error boundary wrapper
export function createServerErrorBoundary<T>(
  fallback: T,
  errorHandler?: (error: Error) => void
) {
  return (operation: () => T): T => {
    try {
      return operation()
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      
      if (errorHandler) {
        errorHandler(err)
      } else {
        ServerErrorHandler.getInstance().handleError(err, "ServerErrorBoundary")
      }
      
      return fallback
    }
  }
}