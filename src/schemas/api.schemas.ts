import { z } from 'zod'

// ============================================================================
// HTTP Types
// ============================================================================

/**
 * HTTP method schema
 */
export const httpMethodSchema = z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
export type HTTPMethod = z.infer<typeof httpMethodSchema>

/**
 * HTTP status code schema with common codes
 */
export const httpStatusCodeSchema = z.enum([
  '200', '201', '204',
  '400', '401', '403', '404', '405', '409', '429',
  '500', '502', '503', '504'
]).transform(Number)
export type HTTPStatusCode = z.infer<typeof httpStatusCodeSchema>

// ============================================================================
// Request/Response Schemas
// ============================================================================

/**
 * Request configuration schema
 */
export const requestConfigSchema = z.object({
  method: httpMethodSchema,
  headers: z.record(z.string()).optional(),
  body: z.unknown().optional(),
  timeout: z.number().int().positive().optional(),
  retries: z.number().int().nonnegative().optional(),
  retryDelay: z.number().int().nonnegative().optional()
})
export type RequestConfig = z.infer<typeof requestConfigSchema>

/**
 * Retry configuration schema
 */
export const retryConfigSchema = z.object({
  maxRetries: z.number().int().nonnegative(),
  baseDelay: z.number().int().positive(),
  maxDelay: z.number().int().positive(),
  backoffFactor: z.number().positive()
})
export type RetryConfig = z.infer<typeof retryConfigSchema>

/**
 * API client configuration schema
 */
export const apiClientConfigSchema = z.object({
  baseURL: z.string().url(),
  timeout: z.number().int().positive(),
  retryConfig: retryConfigSchema,
  defaultHeaders: z.record(z.string())
})
export type APIClientConfig = z.infer<typeof apiClientConfigSchema>

// ============================================================================
// Error Classes (kept for compatibility)
// ============================================================================

export class APIClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly response?: unknown,
    public readonly originalError?: Error
  ) {
    super(message)
    this.name = 'APIClientError'
  }
}

export class NetworkError extends APIClientError {
  constructor(message: string, originalError?: Error) {
    super(message, undefined, undefined, originalError)
    this.name = 'NetworkError'
  }
}

export class TimeoutError extends APIClientError {
  constructor(timeout: number) {
    super(`Request timed out after ${timeout}ms`)
    this.name = 'TimeoutError'
  }
}

export class ValidationError extends APIClientError {
  constructor(
    message: string,
    public readonly validationErrors: readonly string[]
  ) {
    super(message, 400)
    this.name = 'ValidationError'
  }
}