import { useCallback, useEffect, useRef, useState } from 'react'

import {
  CodeSyntaxHighlighter,
  ImportantNote,
  SuccessNote,
} from '@/examples/shared'
import { simulateUnreliableApiCall } from '@/utils/async-helpers'

interface RetryState {
  data: string | null
  loading: boolean
  error: string | null
  attempt: number
  maxAttempts: number
}

/**
 * Custom hook for retry logic with exponential backoff
 */
function useRetryWithBackoff<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
) {
  const [state, setState] = useState<RetryState>({
    data: null,
    loading: false,
    error: null,
    attempt: 0,
    maxAttempts,
  })

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const executeWithRetry = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      attempt: 0,
    }))

    const attemptOperation = async (attemptNumber: number): Promise<T> => {
      setState((prev) => ({ ...prev, attempt: attemptNumber }))

      try {
        const result = await operation()
        setState((prev) => ({
          ...prev,
          data: result as string,
          loading: false,
          error: null,
        }))
        return result
      } catch (error) {
        if (attemptNumber >= maxAttempts) {
          // Max attempts reached - fail permanently
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error'
          setState((prev) => ({
            ...prev,
            loading: false,
            error: `Failed after ${maxAttempts} attempts: ${errorMessage}`,
          }))
          throw error
        }

        // Calculate exponential backoff delay
        const delay = baseDelay * Math.pow(2, attemptNumber - 1)
        const jitter = Math.random() * 0.3 * delay // Add 30% jitter
        const totalDelay = delay + jitter

        setState((prev) => ({
          ...prev,
          error: `Attempt ${attemptNumber} failed, retrying in ${Math.round(totalDelay)}ms...`,
        }))

        // Wait before retrying
        await new Promise((resolve) => {
          retryTimeoutRef.current = setTimeout(resolve, totalDelay)
        })

        // Recursive retry
        return attemptOperation(attemptNumber + 1)
      }
    }

    try {
      await attemptOperation(1)
    } catch {
      // Final failure already handled in attemptOperation
    }
  }, [operation, maxAttempts, baseDelay])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  const reset = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }
    setState({
      data: null,
      loading: false,
      error: null,
      attempt: 0,
      maxAttempts,
    })
  }, [maxAttempts])

  return {
    ...state,
    execute: executeWithRetry,
    reset,
    canRetry: !state.loading && state.attempt < maxAttempts,
  }
}

/**
 * Retry Mechanisms Demo Component
 */
function RetryMechanismsDemo() {
  // Demo with different success rates and retry strategies
  const basicRetry = useRetryWithBackoff(
    () => simulateUnreliableApiCall(0.4), // 40% success rate
    3,
    500
  )

  const aggressiveRetry = useRetryWithBackoff(
    () => simulateUnreliableApiCall(0.2), // 20% success rate - very unreliable
    5,
    1000
  )

  return (
    <div style={{ margin: '2rem 0' }}>
      <h4>Retry Mechanisms with Exponential Backoff</h4>

      <ImportantNote>
        <strong>Exponential Backoff:</strong> A strategy where the delay between
        retry attempts increases exponentially (1s, 2s, 4s, 8s, etc.) to reduce
        server load and improve success rates for transient failures.
      </ImportantNote>

      <CodeSyntaxHighlighter language='typescript' showLineNumbers>
        {`// Retry logic with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      // If this was the last attempt, throw the error
      if (attempt === maxAttempts) {
        throw error
      }

      // Calculate exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1)
      const jitter = Math.random() * 0.3 * delay
      const totalDelay = delay + jitter

      console.log(\`Attempt \${attempt} failed, retrying in \${totalDelay}ms\`)
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, totalDelay))
    }
  }
}`}
      </CodeSyntaxHighlighter>

      <div
        style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: '1fr 1fr',
          margin: '2rem 0',
        }}
      >
        {/* Basic Retry Demo */}
        <div
          style={{
            padding: '1rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: '#f8fafc',
          }}
        >
          <h5>Basic Retry (3 attempts, 500ms base)</h5>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Simulated API with 40% success rate
          </p>

          <div style={{ margin: '1rem 0' }}>
            <button
              onClick={basicRetry.execute}
              disabled={basicRetry.loading}
              style={{
                padding: '0.5rem 1rem',
                margin: '0.5rem 0.5rem 0.5rem 0',
                backgroundColor: basicRetry.loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: basicRetry.loading ? 'not-allowed' : 'pointer',
              }}
            >
              {basicRetry.loading
                ? `Trying... (${basicRetry.attempt}/${basicRetry.maxAttempts})`
                : 'Start Basic Retry'}
            </button>

            <button
              onClick={basicRetry.reset}
              disabled={basicRetry.loading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: basicRetry.loading ? 'not-allowed' : 'pointer',
              }}
            >
              Reset
            </button>
          </div>

          <div
            style={{
              minHeight: '3rem',
              padding: '0.5rem',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            {basicRetry.data && (
              <div style={{ color: '#16a34a' }}>
                ✅ Success: {basicRetry.data}
              </div>
            )}
            {basicRetry.error && (
              <div style={{ color: '#dc2626' }}>❌ {basicRetry.error}</div>
            )}
            {basicRetry.loading && (
              <div style={{ color: '#2563eb' }}>
                🔄 Loading... (Attempt {basicRetry.attempt}/
                {basicRetry.maxAttempts})
              </div>
            )}
            {!basicRetry.data && !basicRetry.error && !basicRetry.loading && (
              <div style={{ color: '#6b7280' }}>Ready to start...</div>
            )}
          </div>
        </div>

        {/* Aggressive Retry Demo */}
        <div
          style={{
            padding: '1rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: '#f8fafc',
          }}
        >
          <h5>Aggressive Retry (5 attempts, 1000ms base)</h5>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Simulated API with 20% success rate (very unreliable)
          </p>

          <div style={{ margin: '1rem 0' }}>
            <button
              onClick={aggressiveRetry.execute}
              disabled={aggressiveRetry.loading}
              style={{
                padding: '0.5rem 1rem',
                margin: '0.5rem 0.5rem 0.5rem 0',
                backgroundColor: aggressiveRetry.loading
                  ? '#9ca3af'
                  : '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: aggressiveRetry.loading ? 'not-allowed' : 'pointer',
              }}
            >
              {aggressiveRetry.loading
                ? `Trying... (${aggressiveRetry.attempt}/${aggressiveRetry.maxAttempts})`
                : 'Start Aggressive Retry'}
            </button>

            <button
              onClick={aggressiveRetry.reset}
              disabled={aggressiveRetry.loading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: aggressiveRetry.loading ? 'not-allowed' : 'pointer',
              }}
            >
              Reset
            </button>
          </div>

          <div
            style={{
              minHeight: '3rem',
              padding: '0.5rem',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            {aggressiveRetry.data && (
              <div style={{ color: '#16a34a' }}>
                ✅ Success: {aggressiveRetry.data}
              </div>
            )}
            {aggressiveRetry.error && (
              <div style={{ color: '#dc2626' }}>❌ {aggressiveRetry.error}</div>
            )}
            {aggressiveRetry.loading && (
              <div style={{ color: '#2563eb' }}>
                🔄 Loading... (Attempt {aggressiveRetry.attempt}/
                {aggressiveRetry.maxAttempts})
              </div>
            )}
            {!aggressiveRetry.data &&
              !aggressiveRetry.error &&
              !aggressiveRetry.loading && (
                <div style={{ color: '#6b7280' }}>Ready to start...</div>
              )}
          </div>
        </div>
      </div>

      <h5>Advanced Retry Strategies</h5>

      <CodeSyntaxHighlighter language='typescript' showLineNumbers>
        {`// Advanced retry with circuit breaker pattern
class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  
  constructor(
    private threshold: number = 5,
    private timeout: number = 60000
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime < this.timeout) {
        throw new Error('Circuit breaker is OPEN')
      }
      this.state = 'HALF_OPEN'
    }

    try {
      const result = await operation()
      this.reset() // Success - reset the circuit breaker
      return result
    } catch (error) {
      this.recordFailure()
      throw error
    }
  }

  private recordFailure() {
    this.failures++
    this.lastFailureTime = Date.now()
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN'
    }
  }

  private reset() {
    this.failures = 0
    this.state = 'CLOSED'
  }
}`}
      </CodeSyntaxHighlighter>

      <SuccessNote>
        <strong>Production Tips:</strong>
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li>
            <strong>Jitter:</strong> Add randomness to retry delays to prevent
            thundering herd
          </li>
          <li>
            <strong>Circuit Breakers:</strong> Stop retrying when system is
            consistently failing
          </li>
          <li>
            <strong>Retry Categories:</strong> Only retry transient errors
            (network, timeouts, 5xx)
          </li>
          <li>
            <strong>User Feedback:</strong> Show progress and allow users to
            cancel long retry sequences
          </li>
        </ul>
      </SuccessNote>
    </div>
  )
}

export default RetryMechanismsDemo
