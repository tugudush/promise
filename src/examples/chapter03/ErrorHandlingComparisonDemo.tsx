import { useCallback, useState } from 'react'

import { CodeSyntaxHighlighter, WarningNote } from '@/examples/shared'
import { simulateUnreliableApiCall } from '@/utils/async-helpers'

/**
 * Interactive demo comparing .catch() vs try/catch error handling patterns
 */
function ErrorHandlingComparisonDemo() {
  const [promiseResult, setPromiseResult] = useState<string>('')
  const [asyncAwaitResult, setAsyncAwaitResult] = useState<string>('')
  const [promiseLoading, setPromiseLoading] = useState(false)
  const [asyncAwaitLoading, setAsyncAwaitLoading] = useState(false)

  // Promise-based error handling with .catch()
  const handleWithPromises = useCallback(() => {
    setPromiseLoading(true)
    setPromiseResult('')

    simulateUnreliableApiCall(0.3) // 30% success rate for demo purposes
      .then((data) => {
        setPromiseResult(`✅ Success: ${data}`)
      })
      .catch((error) => {
        setPromiseResult(`❌ Promise Error: ${error.message}`)
      })
      .finally(() => {
        setPromiseLoading(false)
      })
  }, [])

  // Async/await error handling with try/catch
  const handleWithAsyncAwait = useCallback(async () => {
    setAsyncAwaitLoading(true)
    setAsyncAwaitResult('')

    try {
      const data = await simulateUnreliableApiCall(0.3) // 30% success rate
      setAsyncAwaitResult(`✅ Success: ${data}`)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      setAsyncAwaitResult(`❌ Async/Await Error: ${errorMessage}`)
    } finally {
      setAsyncAwaitLoading(false)
    }
  }, [])

  return (
    <div style={{ margin: '2rem 0' }}>
      <h4>Interactive Comparison: Promise .catch() vs Try/Catch</h4>

      <WarningNote>
        <strong>Demo Note:</strong> This demo uses a simulated API call that
        fails 70% of the time to demonstrate error handling. In real
        applications, you'd want much higher success rates!
      </WarningNote>

      <div
        style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: '1fr 1fr',
          margin: '1rem 0',
        }}
      >
        {/* Promise .catch() Example */}
        <div
          style={{
            padding: '1rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: '#f8fafc',
          }}
        >
          <h5>Promise with .catch()</h5>
          <CodeSyntaxHighlighter language='typescript'>
            {`simulateApiCall()
  .then((data) => {
    setResult(\`Success: \${data}\`)
  })
  .catch((error) => {
    setResult(\`Error: \${error.message}\`)
  })
  .finally(() => {
    setLoading(false)
  })`}
          </CodeSyntaxHighlighter>

          <button
            onClick={handleWithPromises}
            disabled={promiseLoading}
            style={{
              padding: '0.5rem 1rem',
              margin: '0.5rem 0',
              backgroundColor: promiseLoading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: promiseLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {promiseLoading ? 'Loading...' : 'Test Promise .catch()'}
          </button>

          <div
            style={{
              minHeight: '1.5rem',
              padding: '0.5rem',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            {promiseResult || 'No result yet...'}
          </div>
        </div>

        {/* Async/Await Try/Catch Example */}
        <div
          style={{
            padding: '1rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: '#f8fafc',
          }}
        >
          <h5>Async/Await with Try/Catch</h5>
          <CodeSyntaxHighlighter language='typescript'>
            {`try {
  const data = await simulateApiCall()
  setResult(\`Success: \${data}\`)
} catch (error) {
  const message = error instanceof Error 
    ? error.message 
    : 'Unknown error'
  setResult(\`Error: \${message}\`)
} finally {
  setLoading(false)
}`}
          </CodeSyntaxHighlighter>

          <button
            onClick={handleWithAsyncAwait}
            disabled={asyncAwaitLoading}
            style={{
              padding: '0.5rem 1rem',
              margin: '0.5rem 0',
              backgroundColor: asyncAwaitLoading ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: asyncAwaitLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {asyncAwaitLoading ? 'Loading...' : 'Test Try/Catch'}
          </button>

          <div
            style={{
              minHeight: '1.5rem',
              padding: '0.5rem',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            {asyncAwaitResult || 'No result yet...'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h5>Error Propagation Comparison</h5>
        <p>
          Both approaches handle errors effectively, but they differ in how
          errors propagate through your code:
        </p>

        <CodeSyntaxHighlighter language='typescript' showLineNumbers>
          {`// Promise chain error propagation
function fetchUserDataWithPromises(userId: string) {
  return fetchUser(userId)
    .then(user => fetchUserPosts(user.id))
    .then(posts => fetchPostComments(posts))
    .catch(error => {
      // This catch handles errors from ANY step in the chain
      console.error('Error in promise chain:', error)
      throw error // Re-throw to propagate to caller
    })
}

// Async/await error propagation
async function fetchUserDataWithAsync(userId: string) {
  try {
    const user = await fetchUser(userId)
    const posts = await fetchUserPosts(user.id) 
    const comments = await fetchPostComments(posts)
    return comments
  } catch (error) {
    // This catch handles errors from ANY await operation
    console.error('Error in async function:', error)
    throw error // Re-throw to propagate to caller
  }
}`}
        </CodeSyntaxHighlighter>
      </div>
    </div>
  )
}

export default ErrorHandlingComparisonDemo
