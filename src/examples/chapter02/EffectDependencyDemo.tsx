import { useCallback, useEffect, useState } from 'react'

import {
  CodeBlock,
  DemoButton,
  DemoContainer,
  DemoOutput,
  DemoSection,
  ExampleTitle,
  StatusIndicator,
} from '@/examples/shared/TutorialComponents.styles'
import { simulateApiCall } from '@/utils/async-helpers'

/**
 * Demonstrates useEffect dependency patterns and when effects re-run
 * Educational focus: Understanding dependency arrays and avoiding common pitfalls
 */
function EffectDependencyDemo() {
  const [userId, setUserId] = useState('1')
  const [userData, setUserData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchCount, setFetchCount] = useState(0)

  // Counter to show how often effects run
  const [effectRuns, setEffectRuns] = useState(0)
  const [dependentRuns, setDependentRuns] = useState(0)

  // Example 1: Effect with no dependencies (runs after every render)
  // Note: This is intentionally showing what NOT to do
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setEffectRuns((prev) => prev + 1)
    // This would cause infinite loop if we updated state that triggers re-render
    // console.log('Effect with no deps ran')
  }) // No dependency array - demonstrates the problem

  // Example 2: Effect with empty dependencies (runs once on mount)
  useEffect(() => {
    // console.log('Effect with empty deps ran - component mounted')
  }, []) // Empty dependency array

  // Example 3: Effect with dependencies (runs when userId changes)
  useEffect(() => {
    setDependentRuns((prev) => prev + 1)

    if (!userId) return

    const fetchUserData = async () => {
      setLoading(true)
      try {
        const result = await simulateApiCall(
          1000,
          `User data for ID: ${userId}`
        )
        setUserData(result)
        setFetchCount((prev) => prev + 1)
      } catch {
        // Handle error silently for demo purposes
        setUserData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId]) // Runs when userId changes

  // Memoized function to prevent unnecessary effect runs
  const memoizedFetch = useCallback(async (id: string) => {
    const result = await simulateApiCall(800, `Memoized fetch for user ${id}`)
    return result
  }, [])

  // Effect using memoized callback
  useEffect(() => {
    if (!userId) return

    memoizedFetch(userId).then(() => {
      // Result processed silently for demo
    })
  }, [userId, memoizedFetch]) // memoizedFetch is stable due to useCallback

  const changeUserId = () => {
    const ids = ['1', '2', '3', '4', '5']
    const currentIndex = ids.indexOf(userId)
    const nextId = ids[(currentIndex + 1) % ids.length]
    setUserId(nextId)
  }

  const forceRerender = () => {
    // This will trigger effects that don't have dependency arrays
    setFetchCount((prev) => prev)
  }

  const resetDemo = () => {
    setUserId('1')
    setUserData(null)
    setLoading(false)
    setFetchCount(0)
    setEffectRuns(0)
    setDependentRuns(0)
  }

  return (
    <DemoSection>
      <ExampleTitle>Interactive Demo: useEffect Dependencies</ExampleTitle>

      <DemoContainer>
        <div>
          <h4>Controls</h4>
          <DemoButton onClick={changeUserId}>
            Change User ID (Current: {userId})
          </DemoButton>
          <DemoButton onClick={forceRerender}>Force Re-render</DemoButton>
          <DemoButton onClick={resetDemo}>Reset Demo</DemoButton>
        </div>

        <div>
          <h4>Effect Execution Counts</h4>
          <StatusIndicator status='info'>
            No deps effect runs: {effectRuns}
            <br />
            Dependent effect runs: {dependentRuns}
            <br />
            Total data fetches: {fetchCount}
          </StatusIndicator>
        </div>
      </DemoContainer>

      <DemoContainer>
        <div>
          <h4>Current State</h4>
          <p>
            <strong>User ID:</strong> {userId}
          </p>
          <p>
            <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>User Data:</strong> {userData || 'None'}
          </p>
        </div>

        <div>
          <h4>Status</h4>
          <StatusIndicator
            status={loading ? 'loading' : userData ? 'success' : 'idle'}
          >
            {loading && 'Loading user data...'}
            {userData && `Loaded: ${userData}`}
            {!loading && !userData && 'No data loaded'}
          </StatusIndicator>
        </div>
      </DemoContainer>

      <div>
        <h4>Dependency Array Patterns</h4>
        <CodeBlock>
          {`// 1. No dependency array - runs after EVERY render
useEffect(() => {
  console.log('This runs after every render!')
  // ⚠️ Be careful: updating state here causes infinite loop
})

// 2. Empty dependency array - runs ONCE on mount
useEffect(() => {
  console.log('This runs only once when component mounts')
  fetchInitialData()
}, []) // Empty array

// 3. With dependencies - runs when dependencies change
useEffect(() => {
  console.log('This runs when userId changes')
  fetchUserData(userId)
}, [userId]) // Runs when userId changes

// 4. Multiple dependencies
useEffect(() => {
  fetchUserData(userId, filters, sortBy)
}, [userId, filters, sortBy]) // Runs when ANY dependency changes`}
        </CodeBlock>
      </div>

      <div>
        <h4>Common Dependency Pitfalls</h4>
        <CodeBlock>
          {`// ❌ WRONG: Missing dependency (stale closure)
const [count, setCount] = useState(0)
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1) // Always uses initial count (0)
  }, 1000)
  return () => clearInterval(timer)
}, []) // Missing count dependency

// ✅ CORRECT: Include all dependencies
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1) // Use functional update
  }, 1000)
  return () => clearInterval(timer)
}, []) // No dependencies needed with functional update

// ❌ WRONG: Object/function dependencies cause infinite loops
const fetchData = () => { /* ... */ }
useEffect(() => {
  fetchData()
}, [fetchData]) // fetchData is new on every render!

// ✅ CORRECT: Memoize with useCallback
const fetchData = useCallback(() => {
  // Fetch logic
}, [dependency1, dependency2])

useEffect(() => {
  fetchData()
}, [fetchData]) // Now fetchData is stable`}
        </CodeBlock>
      </div>

      <div>
        <h4>Advanced Patterns</h4>
        <CodeBlock>
          {`// Pattern 1: Conditional effects
useEffect(() => {
  if (!shouldFetch) return
  
  fetchData()
}, [shouldFetch, otherDeps])

// Pattern 2: Cleanup with dependencies
useEffect(() => {
  const controller = new AbortController()
  
  fetchData(userId, { signal: controller.signal })
  
  return () => {
    controller.abort() // Cleanup previous request
  }
}, [userId]) // New request when userId changes

// Pattern 3: Debounced effects
useEffect(() => {
  const timeoutId = setTimeout(() => {
    searchAPI(searchTerm)
  }, 300)
  
  return () => clearTimeout(timeoutId)
}, [searchTerm]) // Debounce search when term changes`}
        </CodeBlock>
      </div>

      <DemoOutput>
        <strong>Dependency Array Rules:</strong>
        <br />
        • Include ALL values from component scope used inside effect
        <br />
        • Use empty array [] only for mount-only effects
        <br />
        • Memoize functions/objects with useCallback/useMemo if used as
        dependencies
        <br />
        • Use functional state updates to reduce dependencies
        <br />
        • Always include cleanup for subscriptions/timers
        <br />• ESLint plugin react-hooks/exhaustive-deps helps catch missing
        dependencies
      </DemoOutput>
    </DemoSection>
  )
}

export default EffectDependencyDemo
