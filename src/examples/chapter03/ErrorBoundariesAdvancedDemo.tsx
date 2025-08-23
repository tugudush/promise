import { Component, type ReactNode, useCallback, useState } from 'react'

import {
  CodeSyntaxHighlighter,
  ImportantNote,
  WarningNote,
} from '@/examples/shared'
import { simulateUnreliableApiCall } from '@/utils/async-helpers'

// Error Boundary Component for React errors
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class AsyncErrorBoundary extends Component<
  { children: ReactNode; onError?: (error: Error) => void },
  ErrorBoundaryState
> {
  constructor(props: {
    children: ReactNode
    onError?: (error: Error) => void
  }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    // Log error to monitoring service
    // console.error('Error Boundary caught an error:', error)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            color: '#991b1b',
          }}
        >
          <h4>🚨 Something went wrong!</h4>
          <p>Error: {this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Component that demonstrates async error handling challenges
function ProblematicAsyncComponent() {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [asyncError, setAsyncError] = useState<string | null>(null)

  // This demonstrates the WRONG way - throwing in async operations
  const fetchDataWrongWay = useCallback(async () => {
    setLoading(true)
    setAsyncError(null)

    try {
      const result = await simulateUnreliableApiCall(0.2) // High failure rate
      setData(result)
    } catch (error) {
      // ERROR: This throw will NOT be caught by Error Boundary
      // because it happens in an async context
      if (Math.random() < 0.3) {
        throw error // This will be an unhandled promise rejection
      }

      // CORRECT: Handle the error in component state instead
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      setAsyncError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // This demonstrates the RIGHT way - proper async error handling
  const fetchDataCorrectWay = useCallback(async () => {
    setLoading(true)
    setAsyncError(null)

    try {
      const result = await simulateUnreliableApiCall(0.2)
      setData(result)
    } catch (error) {
      // CORRECT: Always handle async errors in component state
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      setAsyncError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <div style={{ padding: '1rem' }}>Loading data...</div>
  }

  if (asyncError) {
    return (
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          color: '#92400e',
        }}
      >
        <h5>⚠️ Async Error (Handled in Component)</h5>
        <p>{asyncError}</p>
        <button
          onClick={fetchDataCorrectWay}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: '#f0fdf4',
        borderRadius: '8px',
      }}
    >
      <h5>✅ Data Loaded Successfully</h5>
      <p>{data || 'No data yet'}</p>
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={fetchDataWrongWay}
          style={{
            padding: '0.5rem 1rem',
            margin: '0.5rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Fetch (Wrong Way)
        </button>
        <button
          onClick={fetchDataCorrectWay}
          style={{
            padding: '0.5rem 1rem',
            margin: '0.5rem',
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Fetch (Correct Way)
        </button>
      </div>
    </div>
  )
}

/**
 * Advanced Error Boundaries Demo - shows limitations and solutions
 */
function ErrorBoundariesAdvancedDemo() {
  const [errorBoundaryKey, setErrorBoundaryKey] = useState(0)

  const handleErrorBoundaryError = useCallback(() => {
    // In a real app, you might send this to an error monitoring service
  }, [])

  const resetErrorBoundary = useCallback(() => {
    setErrorBoundaryKey((prev) => prev + 1)
  }, [])

  return (
    <div style={{ margin: '2rem 0' }}>
      <h4>Error Boundaries with Async Operations</h4>

      <ImportantNote>
        <strong>Key Limitation:</strong> React Error Boundaries only catch
        errors during rendering, in lifecycle methods, and in constructors. They
        do NOT catch errors in event handlers, async code (like Promise
        callbacks), or during server-side rendering.
      </ImportantNote>

      <CodeSyntaxHighlighter language='typescript' showLineNumbers>
        {`// React Error Boundary - Basic Implementation
class AsyncErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state to show fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to monitoring service
    console.error('Error Boundary caught:', error, errorInfo)
    
    // Send to error monitoring (Sentry, LogRocket, etc.)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h4>Something went wrong!</h4>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.resetErrorBoundary()}>
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}`}
      </CodeSyntaxHighlighter>

      <WarningNote>
        <strong>Demo Instructions:</strong> The "Wrong Way" button may cause
        unhandled promise rejections in the console. The "Correct Way" button
        shows proper async error handling. Both approaches are demonstrated
        below with the same Error Boundary wrapper.
      </WarningNote>

      <div style={{ margin: '1rem 0' }}>
        <AsyncErrorBoundary
          key={errorBoundaryKey}
          onError={handleErrorBoundaryError}
        >
          <ProblematicAsyncComponent />
        </AsyncErrorBoundary>

        <button
          onClick={resetErrorBoundary}
          style={{
            padding: '0.5rem 1rem',
            margin: '1rem 0',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset Error Boundary
        </button>
      </div>

      <h5>Best Practices for Async Error Boundaries</h5>

      <CodeSyntaxHighlighter language='typescript' showLineNumbers>
        {`// Combining Error Boundaries with async error handling
function AsyncDataComponent() {
  const [asyncError, setAsyncError] = useState<Error | null>(null)

  // If we have an async error, throw it during render
  // so the Error Boundary can catch it
  if (asyncError) {
    throw asyncError
  }

  const handleAsyncOperation = async () => {
    try {
      const result = await riskyAsyncOperation()
      // Handle success...
    } catch (error) {
      // Set error in state, which will cause re-render and throw
      setAsyncError(error instanceof Error ? error : new Error('Unknown error'))
    }
  }

  return (
    <div>
      {/* Component JSX */}
      <button onClick={handleAsyncOperation}>
        Perform Async Operation
      </button>
    </div>
  )
}`}
      </CodeSyntaxHighlighter>

      <div
        style={{
          padding: '1rem',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
      >
        <h6>🎯 Error Boundary Strategy Summary:</h6>
        <ol style={{ marginLeft: '1rem' }}>
          <li>
            <strong>Use Error Boundaries</strong> for React rendering errors
          </li>
          <li>
            <strong>Handle async errors in component state</strong> first
          </li>
          <li>
            <strong>Optionally throw async errors during render</strong> to
            trigger Error Boundaries
          </li>
          <li>
            <strong>Provide recovery mechanisms</strong> (retry buttons,
            fallback content)
          </li>
          <li>
            <strong>Log all errors</strong> to monitoring services for debugging
          </li>
        </ol>
      </div>
    </div>
  )
}

export default ErrorBoundariesAdvancedDemo
