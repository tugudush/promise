import React, { useEffect, useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoOutput,
  DemoSection,
  ExampleTitle,
  StatusIndicator,
} from '@/examples/shared'
import { simulateUnreliableApiCall } from '@/utils/async-helpers'

// Error Boundary component
class AsyncErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: {
    children: React.ReactNode
    onError?: (error: Error) => void
  }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    // In a real app, you'd log this to your error reporting service
    // console.error('Error caught by boundary:', error)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <StatusIndicator status='error'>
          <strong>Error Boundary Caught:</strong>
          <br />
          {this.state.error?.message}
          <br />
          <DemoButton
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: '1rem' }}
          >
            Try Again
          </DemoButton>
        </StatusIndicator>
      )
    }

    return this.props.children
  }
}

// Custom hook to throw async errors to error boundary
function useAsyncError() {
  const [, setError] = useState<Error | null>(null)
  return (error: Error) => {
    setError(() => {
      throw error
    })
  }
}

// Component that demonstrates async error handling
function AsyncComponent({ shouldFail }: { shouldFail: boolean }) {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const throwAsyncError = useAsyncError()

  useEffect(() => {
    if (!shouldFail) return

    const fetchData = async () => {
      setLoading(true)
      setLocalError(null)

      try {
        // This will fail 90% of the time for demonstration
        const result = await simulateUnreliableApiCall(0.1, 1500)
        setData(result)
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error')

        // Option 1: Handle locally
        setLocalError(err.message)

        // Option 2: Throw to error boundary (uncomment to test)
        // throwAsyncError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [shouldFail, throwAsyncError])

  if (loading) {
    return <StatusIndicator status='loading'>Loading data...</StatusIndicator>
  }

  if (localError) {
    return (
      <StatusIndicator status='error'>
        <strong>Local Error Handling:</strong>
        <br />
        {localError}
      </StatusIndicator>
    )
  }

  if (data) {
    return (
      <StatusIndicator status='success'>
        <strong>Success:</strong> {data}
      </StatusIndicator>
    )
  }

  return (
    <StatusIndicator status='idle'>
      Ready to test error handling
    </StatusIndicator>
  )
}

// Component that will throw error to boundary
function ErrorThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const throwAsyncError = useAsyncError()

  useEffect(() => {
    if (!shouldThrow) return

    const fetchData = async () => {
      setLoading(true)

      try {
        // Guaranteed to fail for demonstration
        const result = await simulateUnreliableApiCall(0, 1000)
        setData(result)
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error('Simulated async error')
        // This will trigger the error boundary
        throwAsyncError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [shouldThrow, throwAsyncError])

  if (loading) {
    return (
      <StatusIndicator status='loading'>Loading (will fail)...</StatusIndicator>
    )
  }

  return (
    <StatusIndicator status='idle'>
      {data ? `Success: ${data}` : 'Ready to trigger error boundary'}
    </StatusIndicator>
  )
}

/**
 * Demonstrates error boundary patterns with async operations
 * Educational focus: Different error handling strategies and when to use them
 */
function ErrorBoundaryDemo() {
  const [testLocalError, setTestLocalError] = useState(false)
  const [testBoundaryError, setTestBoundaryError] = useState(false)
  const [boundaryErrors, setBoundaryErrors] = useState<string[]>([])

  const handleBoundaryError = (error: Error) => {
    setBoundaryErrors((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${error.message}`,
    ])
  }

  const resetDemo = () => {
    setTestLocalError(false)
    setTestBoundaryError(false)
    setBoundaryErrors([])
  }

  return (
    <DemoSection>
      <ExampleTitle>
        Interactive Demo: Error Boundaries and Async Errors
      </ExampleTitle>

      <DemoContainer>
        <div>
          <h4>Test Error Handling</h4>
          <DemoButton onClick={() => setTestLocalError(!testLocalError)}>
            {testLocalError ? 'Stop' : 'Test Local Error Handling'}
          </DemoButton>

          <DemoButton onClick={() => setTestBoundaryError(!testBoundaryError)}>
            {testBoundaryError ? 'Stop' : 'Test Error Boundary'}
          </DemoButton>

          <DemoButton onClick={resetDemo}>Reset Demo</DemoButton>
        </div>

        <div>
          <h4>Error Log</h4>
          <StatusIndicator status='info'>
            Boundary errors caught: {boundaryErrors.length}
            {boundaryErrors.length > 0 && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9em' }}>
                {boundaryErrors.slice(-3).map((err, idx) => (
                  <div key={idx}>{err}</div>
                ))}
              </div>
            )}
          </StatusIndicator>
        </div>
      </DemoContainer>

      <DemoContainer>
        <div>
          <h4>1. Local Error Handling</h4>
          <AsyncComponent shouldFail={testLocalError} />
        </div>

        <div>
          <h4>2. Error Boundary Handling</h4>
          <AsyncErrorBoundary onError={handleBoundaryError}>
            <ErrorThrowingComponent shouldThrow={testBoundaryError} />
          </AsyncErrorBoundary>
        </div>
      </DemoContainer>

      <div>
        <h4>Error Boundary Implementation</h4>
        <CodeSyntaxHighlighter language='typescript'>
          {`// Error Boundary Class Component
class AsyncErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to service like Sentry, LogRocket, etc.
    console.error('Async error caught:', error, errorInfo)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h3>Something went wrong</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}`}
        </CodeSyntaxHighlighter>
      </div>

      <div>
        <h4>Custom Hook for Async Errors</h4>
        <CodeSyntaxHighlighter language='typescript'>
          {`// Hook to throw async errors to error boundary
function useAsyncError() {
  const [, setError] = useState()
  
  return (error) => {
    setError(() => {
      throw error  // This triggers error boundary
    })
  }
}

// Usage in component
function MyComponent() {
  const throwAsyncError = useAsyncError()
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await riskyAsyncOperation()
      } catch (error) {
        // Option 1: Handle locally
        setLocalError(error.message)
        
        // Option 2: Throw to error boundary
        throwAsyncError(error)
      }
    }
    
    fetchData()
  }, [throwAsyncError])
}`}
        </CodeSyntaxHighlighter>
      </div>

      <div>
        <h4>Error Handling Strategies</h4>
        <CodeSyntaxHighlighter language='typescript'>
          {`// Strategy 1: Local error handling (most common)
const fetchData = async () => {
  try {
    const data = await apiCall()
    setData(data)
    setError(null)
  } catch (error) {
    setError(error.message)
    setData(null)
  }
}

// Strategy 2: Global error boundary
const fetchData = async () => {
  try {
    const data = await apiCall()
    setData(data)
  } catch (error) {
    // For critical errors that should crash the component
    throwAsyncError(error)
  }
}

// Strategy 3: Hybrid approach
const fetchData = async () => {
  try {
    const data = await apiCall()
    setData(data)
  } catch (error) {
    if (error.status >= 500) {
      // Server errors -> error boundary
      throwAsyncError(error)
    } else {
      // Client errors -> local handling
      setError(error.message)
    }
  }
}`}
        </CodeSyntaxHighlighter>
      </div>

      <div>
        <h4>Best Practices</h4>
        <CodeSyntaxHighlighter language='typescript'>
          {`// 1. Granular error boundaries
function App() {
  return (
    <ErrorBoundary fallback={<AppCrashFallback />}>
      <Header />
      <ErrorBoundary fallback={<MainContentError />}>
        <MainContent />
      </ErrorBoundary>
      <ErrorBoundary fallback={<SidebarError />}>
        <Sidebar />
      </ErrorBoundary>
    </ErrorBoundary>
  )
}

// 2. Error boundary with retry functionality
class RetryErrorBoundary extends React.Component {
  state = { hasError: false, retryCount: 0 }
  
  retry = () => {
    this.setState({ 
      hasError: false, 
      retryCount: this.state.retryCount + 1 
    })
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h3>Something went wrong</h3>
          {this.state.retryCount < 3 && (
            <button onClick={this.retry}>
              Retry ({3 - this.state.retryCount} attempts left)
            </button>
          )}
        </div>
      )
    }
    
    // Pass retry count as key to force remount
    return (
      <div key={this.state.retryCount}>
        {this.props.children}
      </div>
    )
  }
}`}
        </CodeSyntaxHighlighter>
      </div>

      <DemoOutput>
        <strong>Error Handling Guidelines:</strong>
        <br />
        • Error boundaries only catch errors in render, lifecycle methods, and
        constructors
        <br />
        • They do NOT catch async errors, event handlers, or timers
        <br />
        • Use custom hooks to throw async errors to error boundaries when needed
        <br />
        • Prefer local error handling for expected/recoverable errors
        <br />
        • Use error boundaries for unexpected/critical errors
        <br />• Implement retry mechanisms and graceful degradation
        <br />• Always provide meaningful error messages to users
      </DemoOutput>
    </DemoSection>
  )
}

export default ErrorBoundaryDemo
