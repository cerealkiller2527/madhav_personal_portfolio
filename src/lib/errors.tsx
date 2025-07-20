"use client"

import React from "react"
import { BlogError, BlogErrorCode } from "@/types/blogTypes"
import { NotionError } from "@/types/notionTypes"
import { APIClientError, NetworkError, TimeoutError } from "@/types/apiTypes"

// =============================================================================
// GENERIC ERROR HANDLERS
// =============================================================================

// Client-side Error Handler
export class ErrorHandler {
  private static instance: ErrorHandler
  private errorListeners: Array<(error: Error) => void> = []

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
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
// ERROR HANDLING UTILITIES
// =============================================================================

// Client-side async error wrapper
export async function withErrorHandling<T>(
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
        ErrorHandler.getInstance().handleError(lastError, context)
        throw lastError
      }

      // Wait before retry with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

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

// Type-safe error boundary wrapper
export function createErrorBoundary<T>(
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
        ErrorHandler.getInstance().handleError(err, "ErrorBoundary")
      }
      
      return fallback
    }
  }
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

// =============================================================================
// REACT ERROR BOUNDARY COMPONENTS
// =============================================================================

// React error boundary HOC
export function withErrorBoundary<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundaryComponent fallback={fallback}>
        <Component {...props} />
      </ErrorBoundaryComponent>
    )
  }
}

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundaryComponent extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    ErrorHandler.getInstance().handleError(error, "React Error Boundary")
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} reset={this.handleReset} />
      }

      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          <button onClick={this.handleReset}>Try again</button>
        </div>
      )
    }

    return this.props.children
  }
}