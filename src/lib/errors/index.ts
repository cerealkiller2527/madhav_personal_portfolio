import { NotionError, NotionErrorCode } from "@/types/notion-unified"
import { NetworkError } from "@/types/apiTypes"

// =============================================================================
// SIMPLE ERROR UTILITIES
// =============================================================================

// Basic error logging
export function logError(error: Error, context?: string): void {
  const message = context ? `[${context}] ${error.message}` : error.message
  console.error(message, error)
}

// =============================================================================
// BLOG ERROR UTILITIES
// =============================================================================

// Convert any error to NotionError
export function handleBlogError(error: unknown, operation: string): NotionError {
  if (error instanceof NotionError) {
    return error
  }

  if (error instanceof NetworkError) {
    return new NotionError(
      `Network error during ${operation}: ${error.message}`,
      NotionErrorCode.NETWORK_ERROR,
      undefined,
      error
    )
  }

  if (error instanceof Error) {
    return new NotionError(
      `Error during ${operation}: ${error.message}`,
      NotionErrorCode.UNKNOWN_ERROR,
      undefined,
      error
    )
  }

  return new NotionError(
    `Unknown error during ${operation}`,
    NotionErrorCode.UNKNOWN_ERROR
  )
}

// Get user-friendly error message
export function getErrorMessage(error: NotionError): string {
  switch (error.code) {
    case NotionErrorCode.NOT_FOUND:
      return "Content not found."
    case NotionErrorCode.NETWORK_ERROR:
      return "Connection error. Please try again."
    case NotionErrorCode.CONFIGURATION_ERROR:
      return "Service not configured."
    case NotionErrorCode.VALIDATION_ERROR:
      return "Invalid data received."
    case NotionErrorCode.CACHE_ERROR:
      return "Cache error."
    case NotionErrorCode.TRANSFORM_ERROR:
      return "Content processing error."
    default:
      return "An error occurred."
  }
}

