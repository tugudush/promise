import {
  CodeSyntaxHighlighter,
  ImportantNote,
  LearningObjective,
  SuccessNote,
  TutorialContent,
  WarningNote,
} from '@/examples/shared'

import ErrorBoundariesAdvancedDemo from './ErrorBoundariesAdvancedDemo'
import ErrorHandlingComparisonDemo from './ErrorHandlingComparisonDemo'
import ProductionErrorHandlingDemo from './ProductionErrorHandlingDemo'
import RetryMechanismsDemo from './RetryMechanismsDemo'

/**
 * Chapter 3: Mastering Error Handling in Async React
 * Complete tutorial content focusing on advanced error handling patterns
 */
function Chapter03Content() {
  return (
    <TutorialContent>
      <h1>Mastering Error Handling in Async React</h1>

      <LearningObjective>
        By the end of this chapter, you will understand:
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li>Different error handling patterns: .catch() vs try/catch</li>
          <li>Error propagation in Promise chains vs async/await</li>
          <li>React Error Boundaries for async operations</li>
          <li>Error recovery and retry mechanisms</li>
          <li>Optimistic updates with error rollback</li>
          <li>Production-ready error monitoring and logging</li>
        </ul>
      </LearningObjective>

      <h2>Error Handling Pattern Comparison</h2>

      <p>
        When working with async operations in React, you have two primary
        approaches for handling errors: the traditional Promise-based{' '}
        <code>.catch()</code> method and the modern <code>try/catch</code>{' '}
        blocks with async/await. Each has its place and understanding when to
        use which approach is crucial for writing robust applications.
      </p>

      <ImportantNote>
        <strong>Key Principle:</strong> Error handling isn't just about catching
        errors—it's about providing meaningful feedback to users and ensuring
        your application remains stable and usable even when things go wrong.
      </ImportantNote>

      <h3>Promise .catch() vs Try/Catch Comparison</h3>

      <p>
        Let's explore the differences between these two approaches with
        practical examples:
      </p>

      <ErrorHandlingComparisonDemo />

      <h3>When to Use Each Approach</h3>

      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: '1fr 1fr',
          margin: '1rem 0',
        }}
      >
        <div>
          <h4>Use .catch() when:</h4>
          <ul>
            <li>Working with Promise chains</li>
            <li>You need to handle specific types of errors differently</li>
            <li>Building reusable Promise-returning functions</li>
            <li>You want explicit error handling at each step</li>
          </ul>
        </div>
        <div>
          <h4>Use try/catch when:</h4>
          <ul>
            <li>Using async/await syntax</li>
            <li>You want to handle multiple operations in one block</li>
            <li>Building linear, procedural-style code</li>
            <li>You need to handle both sync and async errors together</li>
          </ul>
        </div>
      </div>

      <h2>React-Specific Error Strategies</h2>

      <p>
        React applications require special consideration for error handling
        because errors can break component rendering and leave your app in an
        inconsistent state. Let's explore React-specific patterns that ensure
        robust error handling.
      </p>

      <h3>Error Boundaries for Async Operations</h3>

      <p>
        React Error Boundaries catch JavaScript errors anywhere in the component
        tree, but they have limitations with async operations. Here's how to
        work around those limitations:
      </p>

      <ErrorBoundariesAdvancedDemo />

      <WarningNote>
        <strong>Important:</strong> React Error Boundaries do not catch errors
        in event handlers, async code, or during server-side rendering. You need
        additional strategies for these scenarios.
      </WarningNote>

      <h3>Component Error States and Recovery</h3>

      <p>
        Beyond just catching errors, good React error handling involves managing
        error states, providing user-friendly messages, and offering recovery
        options:
      </p>

      <CodeSyntaxHighlighter language='typescript' showLineNumbers>
        {`// Comprehensive error state management in React
interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
  retryCount: number
}

function useAsyncOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0,
  })

  const executeOperation = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await operation()
      setState({
        data: result,
        loading: false,
        error: null,
        retryCount: 0,
      })
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred'
        
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        retryCount: prev.retryCount + 1,
      }))
    }
  }, [operation])

  const retry = useCallback(() => {
    if (state.retryCount < maxRetries) {
      executeOperation()
    }
  }, [executeOperation, state.retryCount, maxRetries])

  return {
    ...state,
    execute: executeOperation,
    retry,
    canRetry: state.retryCount < maxRetries,
  }
}`}
      </CodeSyntaxHighlighter>

      <h3>Retry Mechanisms and Exponential Backoff</h3>

      <p>
        For network operations and API calls, implementing retry logic with
        exponential backoff can significantly improve user experience by
        automatically recovering from transient errors:
      </p>

      <RetryMechanismsDemo />

      <h2>Production-Ready Error Handling</h2>

      <p>
        In production applications, error handling goes beyond just showing
        error messages to users. You need comprehensive logging, monitoring, and
        graceful degradation strategies.
      </p>

      <h3>Error Monitoring and Logging</h3>

      <p>
        Effective error handling includes capturing errors for analysis and
        debugging. Here's how to implement comprehensive error tracking:
      </p>

      <CodeSyntaxHighlighter language='typescript' showLineNumbers>
        {`// Production error handling with logging and monitoring
interface ErrorContext {
  userId?: string
  componentName: string
  operation: string
  timestamp: Date
  userAgent: string
  url: string
}

class ErrorLogger {
  private static instance: ErrorLogger
  private errorQueue: Array<{ error: Error; context: ErrorContext }> = []

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  logError(error: Error, context: ErrorContext): void {
    // Add to queue for batch processing
    this.errorQueue.push({ error, context })
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Async Error Logged')
      console.error('Error:', error)
      console.table(context)
      console.groupEnd()
    }

    // Send to monitoring service (e.g., Sentry, LogRocket)
    this.sendToMonitoring({ error, context })
    
    // Process queue periodically
    this.processQueue()
  }

  private async sendToMonitoring(errorInfo: { error: Error; context: ErrorContext }) {
    try {
      // Example: Send to monitoring service
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: errorInfo.error.message,
          stack: errorInfo.error.stack,
          context: errorInfo.context,
        })
      })
    } catch (monitoringError) {
      // Fail silently - don't break the app because logging failed
      console.warn('Failed to send error to monitoring:', monitoringError)
    }
  }

  private processQueue(): void {
    // Batch process errors to avoid overwhelming the monitoring service
    if (this.errorQueue.length >= 5) {
      this.errorQueue.splice(0, 5) // Process and remove first 5 errors
    }
  }
}`}
      </CodeSyntaxHighlighter>

      <h3>Graceful Degradation and Fallbacks</h3>

      <p>
        When errors occur, your application should degrade gracefully rather
        than breaking completely. This involves providing fallback content,
        alternative workflows, and clear user guidance:
      </p>

      <ProductionErrorHandlingDemo />

      <h3>Network vs Application Error Handling</h3>

      <p>
        Different types of errors require different handling strategies. Here's
        how to categorize and handle various error types:
      </p>

      <CodeSyntaxHighlighter language='typescript' showLineNumbers>
        {`// Categorizing and handling different error types
enum ErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation', 
  AUTHORIZATION = 'authorization',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown'
}

interface AppError {
  type: ErrorType
  message: string
  userMessage: string
  retryable: boolean
  statusCode?: number
}

function categorizeError(error: unknown): AppError {
  // Network errors (fetch failures, timeouts)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: ErrorType.NETWORK,
      message: error.message,
      userMessage: 'Unable to connect to server. Please check your internet connection.',
      retryable: true,
    }
  }

  // HTTP errors from API responses
  if (error && typeof error === 'object' && 'status' in error) {
    const httpError = error as { status: number; message: string }
    
    switch (true) {
      case httpError.status >= 400 && httpError.status < 500:
        return {
          type: ErrorType.VALIDATION,
          message: httpError.message,
          userMessage: 'Please check your input and try again.',
          retryable: false,
          statusCode: httpError.status,
        }
        
      case httpError.status >= 500:
        return {
          type: ErrorType.SERVER,
          message: httpError.message,
          userMessage: 'Server error. Please try again later.',
          retryable: true,
          statusCode: httpError.status,
        }
    }
  }

  // Generic error fallback
  return {
    type: ErrorType.UNKNOWN,
    message: error instanceof Error ? error.message : 'Unknown error',
    userMessage: 'Something went wrong. Please try again.',
    retryable: false,
  }
}`}
      </CodeSyntaxHighlighter>

      <SuccessNote>
        <strong>Best Practice:</strong> Always provide users with actionable
        error messages. Instead of technical error details, tell users what went
        wrong and what they can do about it. Reserve technical details for
        logging and debugging.
      </SuccessNote>

      <h2>Key Takeaways</h2>

      <ul>
        <li>
          <strong>Choose the right pattern:</strong> Use .catch() for Promise
          chains and try/catch for async/await operations
        </li>
        <li>
          <strong>React Error Boundaries</strong> are powerful but have
          limitations with async operations—supplement with component-level
          error handling
        </li>
        <li>
          <strong>Implement retry mechanisms</strong> with exponential backoff
          for transient network errors
        </li>
        <li>
          <strong>Categorize errors</strong> and handle each type appropriately
          with user-friendly messages
        </li>
        <li>
          <strong>Log and monitor errors</strong> for debugging and improving
          your application's reliability
        </li>
        <li>
          <strong>Design for failure:</strong> Build fallback strategies and
          graceful degradation into your application from the start
        </li>
      </ul>

      <ImportantNote>
        <strong>Next Up:</strong> In Chapter 4, we'll explore modern async/await
        syntax patterns and learn how they can simplify complex asynchronous
        operations while maintaining robust error handling.
      </ImportantNote>
    </TutorialContent>
  )
}

export default Chapter03Content
