// Generic API Response Types
export interface APIResponse<T = unknown> {
  readonly success: boolean
  readonly data?: T
  readonly error?: APIError
  readonly metadata?: ResponseMetadata
}

export interface ResponseMetadata {
  readonly timestamp: string
  readonly requestId?: string
  readonly version?: string
  readonly executionTime?: number
}

export interface APIError {
  readonly code: string
  readonly message: string
  readonly details?: Record<string, unknown>
  readonly stackTrace?: string
}

// HTTP Types
export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE"
}

export enum HTTPStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504
}

// Request Configuration
export interface RequestConfig {
  readonly method: HTTPMethod
  readonly headers?: Record<string, string>
  readonly body?: unknown
  readonly timeout?: number
  readonly retries?: number
  readonly retryDelay?: number
}

export interface RetryConfig {
  readonly maxRetries: number
  readonly baseDelay: number
  readonly maxDelay: number
  readonly backoffFactor: number
}

// Client Configuration
export interface APIClientConfig {
  readonly baseURL: string
  readonly timeout: number
  readonly retryConfig: RetryConfig
  readonly defaultHeaders: Record<string, string>
}

// Error Types
export class APIClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: HTTPStatusCode,
    public readonly response?: unknown,
    public readonly originalError?: Error
  ) {
    super(message)
    this.name = "APIClientError"
  }
}

export class NetworkError extends APIClientError {
  constructor(message: string, originalError?: Error) {
    super(message, undefined, undefined, originalError)
    this.name = "NetworkError"
  }
}

export class TimeoutError extends APIClientError {
  constructor(timeout: number) {
    super(`Request timed out after ${timeout}ms`)
    this.name = "TimeoutError"
  }
}

export class ValidationError extends APIClientError {
  constructor(
    message: string,
    public readonly validationErrors: readonly string[]
  ) {
    super(message, HTTPStatusCode.BAD_REQUEST)
    this.name = "ValidationError"
  }
}

// Type Guards
export function isSuccessResponse<T>(
  response: APIResponse<T>
): response is APIResponse<T> & { success: true; data: T } {
  return response.success && response.data !== undefined
}

export function isErrorResponse<T>(
  response: APIResponse<T>
): response is APIResponse<T> & { success: false; error: APIError } {
  return !response.success && response.error !== undefined
}

export function isHTTPError(error: Error): error is APIClientError {
  return error instanceof APIClientError && error.statusCode !== undefined
}

export function isNetworkError(error: Error): error is NetworkError {
  return error instanceof NetworkError
}

export function isTimeoutError(error: Error): error is TimeoutError {
  return error instanceof TimeoutError
}

export function isValidationError(error: Error): error is ValidationError {
  return error instanceof ValidationError
}