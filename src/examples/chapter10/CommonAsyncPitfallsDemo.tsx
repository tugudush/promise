import { useCallback, useEffect, useRef, useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoSection,
  ExampleTitle,
  StatusIndicator,
} from '@/examples/shared'
import { simulateApiCall } from '@/utils/async-helpers'

function CommonAsyncPitfallsDemo() {
  return (
    <DemoSection>
      <ExampleTitle>Demo: Common Async Pitfalls</ExampleTitle>
      <p>
        Explore common async pitfalls and their solutions through interactive
        examples that demonstrate memory leaks, race conditions, and proper
        cleanup patterns.
      </p>

      <MemoryLeakDemo />
      <RaceConditionDemo />
      <ProperCleanupDemo />
    </DemoSection>
  )
}

// Demo of memory leak potential
function MemoryLeakDemo() {
  const [showBadExample, setShowBadExample] = useState(false)
  const [showGoodExample, setShowGoodExample] = useState(false)

  return (
    <DemoContainer>
      <h4>Memory Leak Prevention</h4>
      <p>
        Click the buttons below to see the difference between components that
        can cause memory leaks and those with proper cleanup:
      </p>

      <div>
        <DemoButton onClick={() => setShowBadExample(!showBadExample)}>
          {showBadExample ? 'Hide' : 'Show'} Problematic Component
        </DemoButton>
        <DemoButton onClick={() => setShowGoodExample(!showGoodExample)}>
          {showGoodExample ? 'Hide' : 'Show'} Proper Cleanup Component
        </DemoButton>
      </div>

      {showBadExample && <BadMemoryComponent />}
      {showGoodExample && <GoodMemoryComponent />}

      <CodeSyntaxHighlighter language='typescript'>
        {`// The key difference: proper cleanup prevents memory leaks

// ❌ BAD: No cleanup
useEffect(() => {
  fetchData().then(setData) // Can update unmounted component
}, [])

// ✅ GOOD: Proper cleanup  
useEffect(() => {
  let isMounted = true
  
  const loadData = async () => {
    const result = await fetchData()
    if (isMounted) {
      setData(result) // Only update if still mounted
    }
  }
  
  loadData()
  return () => { isMounted = false } // Cleanup
}, [])`}
      </CodeSyntaxHighlighter>
    </DemoContainer>
  )
}

function BadMemoryComponent() {
  const [data, setData] = useState<string | null>(null)
  const [status, setStatus] = useState('mounting')

  useEffect(() => {
    setStatus('loading')

    // ❌ BAD: No cleanup - this promise will try to update state
    // even if component unmounts before it resolves
    simulateApiCall(3000)
      .then((result) => {
        setData(result)
        setStatus('loaded')
      })
      .catch(() => {
        setStatus('error')
      })
  }, [])

  return (
    <div
      style={{
        padding: '1rem',
        background: '#fee2e2',
        borderRadius: '8px',
        margin: '1rem 0',
      }}
    >
      <h5>❌ Bad Component (Potential Memory Leak)</h5>
      <StatusIndicator status={status}>Status: {status}</StatusIndicator>
      {data && <div>Data: {data}</div>}
      <p style={{ fontSize: '0.875rem', color: '#dc2626' }}>
        ⚠️ This component doesn't clean up its async operation. If you unmount
        it quickly, it may still try to update state after unmounting.
      </p>
    </div>
  )
}

function GoodMemoryComponent() {
  const [data, setData] = useState<string | null>(null)
  const [status, setStatus] = useState('mounting')

  useEffect(() => {
    let isMounted = true
    setStatus('loading')

    const loadData = async () => {
      try {
        const result = await simulateApiCall(3000)

        // ✅ GOOD: Only update state if component is still mounted
        if (isMounted) {
          setData(result)
          setStatus('loaded')
        }
      } catch {
        if (isMounted) {
          setStatus('error')
        }
      }
    }

    loadData()

    // ✅ GOOD: Cleanup function prevents state updates after unmount
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div
      style={{
        padding: '1rem',
        background: '#dcfce7',
        borderRadius: '8px',
        margin: '1rem 0',
      }}
    >
      <h5>✅ Good Component (Proper Cleanup)</h5>
      <StatusIndicator status={status}>Status: {status}</StatusIndicator>
      {data && <div>Data: {data}</div>}
      <p style={{ fontSize: '0.875rem', color: '#166534' }}>
        ✅ This component properly cleans up and won't update state if unmounted
        before the async operation completes.
      </p>
    </div>
  )
}

// Demo of race condition issues
function RaceConditionDemo() {
  const [userId, setUserId] = useState('user1')
  const [showBadExample, setShowBadExample] = useState(false)
  const [showGoodExample, setShowGoodExample] = useState(false)

  const userIds = ['user1', 'user2', 'user3', 'user4']

  return (
    <DemoContainer>
      <h4>Race Condition Prevention</h4>
      <p>
        Rapidly change the user ID to see how race conditions can occur when
        multiple async operations are in flight:
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label>Select User ID: </label>
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          {userIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>

      <div>
        <DemoButton onClick={() => setShowBadExample(!showBadExample)}>
          {showBadExample ? 'Hide' : 'Show'} Race Condition Component
        </DemoButton>
        <DemoButton onClick={() => setShowGoodExample(!showGoodExample)}>
          {showGoodExample ? 'Hide' : 'Show'} Race-Safe Component
        </DemoButton>
      </div>

      {showBadExample && <BadRaceConditionComponent userId={userId} />}
      {showGoodExample && <GoodRaceConditionComponent userId={userId} />}

      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>
        💡 Tip: Rapidly change the user ID while watching the components. The
        bad example may show data for the wrong user if responses return out of
        order.
      </p>
    </DemoContainer>
  )
}

function BadRaceConditionComponent({ userId }: { userId: string }) {
  const [userData, setUserData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    // ❌ BAD: No race condition protection
    // If userId changes quickly, older requests might overwrite newer ones
    simulateApiCall(Math.random() * 2000 + 1000) // Random delay
      .then((result) => {
        setUserData(`Data for ${userId}: ${result}`)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [userId])

  return (
    <div
      style={{
        padding: '1rem',
        background: '#fee2e2',
        borderRadius: '8px',
        margin: '1rem 0',
      }}
    >
      <h5>❌ Race Condition Component</h5>
      <div>Current User ID: {userId}</div>
      <StatusIndicator status={loading ? 'loading' : 'idle'}>
        {loading ? 'Loading...' : userData || 'No data'}
      </StatusIndicator>
    </div>
  )
}

function GoodRaceConditionComponent({ userId }: { userId: string }) {
  const [userData, setUserData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isCurrent = true
    setLoading(true)

    const loadUserData = async () => {
      try {
        const result = await simulateApiCall(Math.random() * 2000 + 1000)

        // ✅ GOOD: Only update if this effect is still current
        if (isCurrent) {
          setUserData(`Data for ${userId}: ${result}`)
          setLoading(false)
        }
      } catch {
        if (isCurrent) {
          setLoading(false)
        }
      }
    }

    loadUserData()

    // ✅ GOOD: Mark this effect as stale when cleanup runs
    return () => {
      isCurrent = false
    }
  }, [userId])

  return (
    <div
      style={{
        padding: '1rem',
        background: '#dcfce7',
        borderRadius: '8px',
        margin: '1rem 0',
      }}
    >
      <h5>✅ Race-Safe Component</h5>
      <div>Current User ID: {userId}</div>
      <StatusIndicator status={loading ? 'loading' : 'idle'}>
        {loading ? 'Loading...' : userData || 'No data'}
      </StatusIndicator>
    </div>
  )
}

// Demo of proper cleanup patterns
function ProperCleanupDemo() {
  const [showAbortController, setShowAbortController] = useState(false)
  const [showCustomCleanup, setShowCustomCleanup] = useState(false)

  return (
    <DemoContainer>
      <h4>Advanced Cleanup Patterns</h4>
      <p>Learn different cleanup strategies for various async scenarios:</p>

      <div>
        <DemoButton
          onClick={() => setShowAbortController(!showAbortController)}
        >
          {showAbortController ? 'Hide' : 'Show'} AbortController Pattern
        </DemoButton>
        <DemoButton onClick={() => setShowCustomCleanup(!showCustomCleanup)}>
          {showCustomCleanup ? 'Hide' : 'Show'} Custom Cleanup Pattern
        </DemoButton>
      </div>

      {showAbortController && <AbortControllerDemo />}
      {showCustomCleanup && <CustomCleanupDemo />}
    </DemoContainer>
  )
}

function AbortControllerDemo() {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [aborted, setAborted] = useState(false)
  const abortController = useRef<AbortController | null>(null)

  const startRequest = useCallback(() => {
    // Cancel any existing request
    if (abortController.current) {
      abortController.current.abort()
    }

    abortController.current = new AbortController()
    setLoading(true)
    setAborted(false)
    setData(null)

    // Simulate a fetch request with AbortController
    const fetchWithAbort = async (signal: AbortSignal) => {
      for (let i = 0; i < 30; i++) {
        if (signal.aborted) {
          throw new Error('[EDUCATIONAL DEMO] Request aborted')
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      return 'Data loaded successfully'
    }

    fetchWithAbort(abortController.current.signal)
      .then((result) => {
        if (!abortController.current?.signal.aborted) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((error) => {
        if (error.message === 'Request aborted') {
          setAborted(true)
        }
        setLoading(false)
      })
  }, [])

  const cancelRequest = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort()
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort()
      }
    }
  }, [])

  return (
    <div
      style={{
        padding: '1rem',
        background: '#f0f9ff',
        borderRadius: '8px',
        margin: '1rem 0',
      }}
    >
      <h5>AbortController Pattern</h5>
      <div>
        <DemoButton onClick={startRequest} disabled={loading}>
          Start 3-second Request
        </DemoButton>
        <DemoButton onClick={cancelRequest} disabled={!loading}>
          Cancel Request
        </DemoButton>
      </div>

      <StatusIndicator
        status={loading ? 'loading' : aborted ? 'error' : 'idle'}
      >
        {loading && 'Loading... (click cancel to abort)'}
        {aborted && 'Request was cancelled'}
        {data && data}
        {!loading && !aborted && !data && 'Ready to start request'}
      </StatusIndicator>

      <CodeSyntaxHighlighter language='typescript'>
        {`// AbortController provides native cancellation
const controller = new AbortController()

fetch('/api/data', { signal: controller.signal })
  .then(response => response.json())
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('[EDUCATIONAL DEMO] Request was cancelled')
    }
  })

// Cancel the request
controller.abort()`}
      </CodeSyntaxHighlighter>
    </div>
  )
}

function CustomCleanupDemo() {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  const startCustomAsyncOperation = useCallback(() => {
    // Clean up any previous operation
    if (cleanupRef.current) {
      cleanupRef.current()
    }

    setLoading(true)
    setData(null)

    let cancelled = false
    let timeoutId: NodeJS.Timeout

    const customAsyncOperation = () => {
      return new Promise<string>((resolve, reject) => {
        timeoutId = setTimeout(() => {
          if (cancelled) {
            reject(new Error('[EDUCATIONAL DEMO] Operation cancelled'))
          } else {
            resolve('Custom async operation completed')
          }
        }, 2500)
      })
    }

    // Set up cleanup function
    cleanupRef.current = () => {
      cancelled = true
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      setLoading(false)
    }

    customAsyncOperation()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
  }, [])

  const cancelOperation = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current()
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
      }
    }
  }, [])

  return (
    <div
      style={{
        padding: '1rem',
        background: '#f0fdf4',
        borderRadius: '8px',
        margin: '1rem 0',
      }}
    >
      <h5>Custom Cleanup Pattern</h5>
      <div>
        <DemoButton onClick={startCustomAsyncOperation} disabled={loading}>
          Start Custom Operation
        </DemoButton>
        <DemoButton onClick={cancelOperation} disabled={!loading}>
          Cancel Operation
        </DemoButton>
      </div>

      <StatusIndicator status={loading ? 'loading' : 'idle'}>
        {loading ? 'Custom operation running...' : data || 'Ready to start'}
      </StatusIndicator>

      <p style={{ fontSize: '0.875rem', color: '#15803d', marginTop: '1rem' }}>
        💡 This pattern is useful for custom async operations that don't support
        AbortController, like animations, intervals, or third-party libraries.
      </p>
    </div>
  )
}

export default CommonAsyncPitfallsDemo
