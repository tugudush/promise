import { useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoOutput,
  DemoSection,
  StatusIndicator,
} from '@/examples/shared'
import {
  simulateApiCall,
  simulateUnreliableApiCall,
} from '@/utils/async-helpers'

/**
 * Interactive demo showing async/await basics in React
 * Educational purpose: Understand async/await syntax and error handling
 */
function AsyncAwaitBasicsDemo() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'fulfilled' | 'rejected'
  >('idle')

  // Basic async function
  const handleBasicAsync = async () => {
    setLoading(true)
    setError('')
    setResult('')
    setStatus('pending')

    try {
      const data = await simulateApiCall(1500)
      setResult(`✅ Success: ${data}`)
      setStatus('fulfilled')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setStatus('rejected')
    } finally {
      setLoading(false)
    }
  }

  // Async function with potential failure
  const handleUnreliableAsync = async () => {
    setLoading(true)
    setError('')
    setResult('')
    setStatus('pending')

    try {
      const data = await simulateUnreliableApiCall(0.6) // 60% success rate
      setResult(`🎉 Success: ${data}`)
      setStatus('fulfilled')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`❌ ${errorMessage}`)
      setStatus('rejected')
    } finally {
      setLoading(false)
    }
  }

  // Multiple step async operation
  const handleMultiStep = async () => {
    setLoading(true)
    setError('')
    setResult('')
    setStatus('pending')

    try {
      setResult('Step 1: Initializing...')
      await simulateApiCall(800)

      setResult((prev) => `${prev}\nStep 2: Processing data...`)
      await simulateApiCall(600)

      setResult((prev) => `${prev}\nStep 3: Finalizing...`)
      await simulateApiCall(400)

      setResult((prev) => `${prev}\n✅ All steps completed successfully!`)
      setStatus('fulfilled')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`❌ Failed at step: ${errorMessage}`)
      setStatus('rejected')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DemoSection>
      <h3>🚀 Async/Await Basics in React</h3>
      <p>
        Try these different async operations to see how async/await works in
        React components:
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4>Current Status:</h4>
        <StatusIndicator status={status}>
          {status === 'idle' && '⏳ Ready to start'}
          {status === 'pending' && '🔄 Operation in progress...'}
          {status === 'fulfilled' && '✅ Operation completed successfully'}
          {status === 'rejected' && '❌ Operation failed'}
        </StatusIndicator>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <DemoButton onClick={handleBasicAsync} disabled={loading}>
          {loading ? 'Running...' : 'Basic Async'}
        </DemoButton>

        <DemoButton onClick={handleUnreliableAsync} disabled={loading}>
          {loading ? 'Running...' : 'Unreliable Async (60% success)'}
        </DemoButton>

        <DemoButton onClick={handleMultiStep} disabled={loading}>
          {loading ? 'Running...' : 'Multi-Step Async'}
        </DemoButton>
      </div>

      {(result || error) && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Output:</h4>
          {error && (
            <DemoOutput style={{ background: '#fee2e2', color: '#991b1b' }}>
              {error}
            </DemoOutput>
          )}
          {result && !error && <DemoOutput>{result}</DemoOutput>}
        </div>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <h4>Code Pattern:</h4>
        <CodeSyntaxHighlighter language='typescript'>
          {`// Basic async/await pattern in React
const handleAsyncOperation = async () => {
  setLoading(true)
  setError('')
  
  try {
    // Await the async operation
    const result = await someAsyncFunction()
    
    // Update state with successful result
    setData(result)
    
  } catch (error) {
    // Handle any errors
    setError(error.message)
    
  } finally {
    // Always runs, regardless of success or failure
    setLoading(false)
  }
}

// Usage in JSX
<button 
  onClick={handleAsyncOperation}
  disabled={loading}
>
  {loading ? 'Loading...' : 'Start Operation'}
</button>`}
        </CodeSyntaxHighlighter>
      </div>
    </DemoSection>
  )
}

export default AsyncAwaitBasicsDemo
