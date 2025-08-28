import { useCallback, useEffect, useState } from 'react'

import { DemoButton, DemoContainer, DemoSection } from '@/examples/shared'
import { simulateApiCall } from '@/utils/async-helpers'

import CodeSyntaxHighlighter from '../shared/SyntaxHighlighter'

interface AsyncState {
  data: string | null
  loading: boolean
  error: string | null
  mountStatus: string
}

/**
 * Interactive demo showing proper useEffect patterns with async operations
 */
export function UseEffectAsyncDemo() {
  const [asyncState, setAsyncState] = useState<AsyncState>({
    data: null,
    loading: false,
    error: null,
    mountStatus: 'Component mounted',
  })

  const [demoType, setDemoType] = useState<
    'correct' | 'with-cleanup' | 'wrong'
  >('correct')

  // Demo 1: Correct async pattern in useEffect
  const correctAsyncEffect = useCallback(() => {
    setAsyncState((prev) => ({ ...prev, loading: true, error: null }))

    const fetchDataAsync = async () => {
      try {
        const data = await simulateApiCall(2000)
        setAsyncState((prev) => ({
          ...prev,
          data,
          loading: false,
        }))
      } catch (error) {
        setAsyncState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
          loading: false,
        }))
      }
    }

    fetchDataAsync()
  }, [])

  // Demo 2: With proper cleanup
  useEffect(() => {
    if (demoType !== 'with-cleanup') return

    const abortController = new AbortController()

    const fetchWithCleanup = async () => {
      setAsyncState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        // Simulate fetch with abort signal
        await new Promise((resolve, reject) => {
          const timeoutId = setTimeout(resolve, 2000)

          abortController.signal.addEventListener('abort', () => {
            clearTimeout(timeoutId)
            reject(new Error('Operation cancelled'))
          })
        })

        if (!abortController.signal.aborted) {
          setAsyncState((prev) => ({
            ...prev,
            data: 'Data with proper cleanup!',
            loading: false,
          }))
        }
      } catch (error) {
        if (error instanceof Error && error.message !== 'Operation cancelled') {
          setAsyncState((prev) => ({
            ...prev,
            error: error.message,
            loading: false,
          }))
        }
      }
    }

    fetchWithCleanup()

    return () => {
      abortController.abort()
      setAsyncState((prev) => ({
        ...prev,
        mountStatus: 'Cleanup function called',
      }))
    }
  }, [demoType])

  const handleDemoChange = (type: typeof demoType) => {
    setDemoType(type)
    setAsyncState({
      data: null,
      loading: false,
      error: null,
      mountStatus: 'Demo reset',
    })
  }

  const runCorrectDemo = () => {
    correctAsyncEffect()
  }

  return (
    <DemoSection>
      <h3>Interactive Demo: useEffect with Async Operations</h3>

      <div style={{ marginBottom: '2rem' }}>
        <h4>Choose Demo Type:</h4>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <DemoButton
            onClick={() => handleDemoChange('correct')}
            style={{
              backgroundColor: demoType === 'correct' ? '#3b82f6' : '#6b7280',
            }}
          >
            Correct Pattern
          </DemoButton>
          <DemoButton
            onClick={() => handleDemoChange('with-cleanup')}
            style={{
              backgroundColor:
                demoType === 'with-cleanup' ? '#3b82f6' : '#6b7280',
            }}
          >
            With Cleanup
          </DemoButton>
          <DemoButton
            onClick={() => handleDemoChange('wrong')}
            disabled
            style={{
              backgroundColor: '#d1d5db',
              cursor: 'not-allowed',
            }}
          >
            Wrong Pattern (Disabled)
          </DemoButton>
        </div>
      </div>

      <DemoContainer>
        <div>
          <h4>
            Current Demo:{' '}
            {demoType === 'correct'
              ? 'Basic Async Pattern'
              : 'With AbortController Cleanup'}
          </h4>

          {demoType === 'correct' && (
            <DemoButton onClick={runCorrectDemo} disabled={asyncState.loading}>
              {asyncState.loading ? 'Loading...' : 'Trigger Async Operation'}
            </DemoButton>
          )}

          {demoType === 'with-cleanup' && (
            <p>
              This demo runs automatically and shows proper cleanup when
              switching demos.
            </p>
          )}

          <div
            style={{
              padding: '1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              margin: '1rem 0',
              fontFamily: 'monospace',
            }}
          >
            <div>
              <strong>Mount Status:</strong> {asyncState.mountStatus}
            </div>
            <div>
              <strong>Loading:</strong> {asyncState.loading ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Data:</strong> {asyncState.data || 'None'}
            </div>
            <div>
              <strong>Error:</strong> {asyncState.error || 'None'}
            </div>
          </div>
        </div>

        <div>
          <h4>Code Pattern:</h4>
          {demoType === 'correct' && (
            <CodeSyntaxHighlighter language='typescript'>
              {`// ✅ Correct Pattern
useEffect(() => {
  const fetchDataAsync = async () => {
    try {
      setLoading(true)
      const data = await simulateApiCall(2000)
      setData(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  fetchDataAsync()
}, [])

// Usage
<button onClick={correctAsyncEffect}>
  {loading ? 'Loading...' : 'Trigger Operation'}
</button>`}
            </CodeSyntaxHighlighter>
          )}

          {demoType === 'with-cleanup' && (
            <CodeSyntaxHighlighter language='typescript'>
              {`// ✅ With Proper Cleanup
useEffect(() => {
  const abortController = new AbortController()
  
  const fetchData = async () => {
    try {
      setLoading(true)
      // Pass signal to fetch or use it to check cancellation
      const response = await fetch('/api/data', {
        signal: abortController.signal
      })
      
      if (!abortController.signal.aborted) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error.message)
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false)
      }
    }
  }
  
  fetchData()
  
  // Cleanup function
  return () => {
    abortController.abort()
  }
}, [])`}
            </CodeSyntaxHighlighter>
          )}

          {demoType === 'wrong' && (
            <CodeSyntaxHighlighter language='typescript'>
              {`// ❌ WRONG - Don't do this!
useEffect(async () => {
  // This will cause a TypeScript error
  // useEffect cannot be async
  const data = await fetchData()
  setData(data)
}, [])

// Error: Argument of type '() => Promise<void>' 
// is not assignable to parameter of type 'EffectCallback'`}
            </CodeSyntaxHighlighter>
          )}
        </div>
      </DemoContainer>

      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #f59e0b',
        }}
      >
        <h4 style={{ color: '#92400e', marginTop: 0 }}>
          💡 Key Learning Points:
        </h4>
        <ul style={{ color: '#92400e', marginBottom: 0 }}>
          <li>
            <strong>useEffect cannot be async</strong> - Define async functions
            inside the effect
          </li>
          <li>
            <strong>Always handle cleanup</strong> - Use AbortController to
            prevent memory leaks
          </li>
          <li>
            <strong>Check mount status</strong> - Avoid updating state on
            unmounted components
          </li>
          <li>
            <strong>Handle all states</strong> - Loading, success, and error
            scenarios
          </li>
        </ul>
      </div>
    </DemoSection>
  )
}
