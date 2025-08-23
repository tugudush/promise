import {
  CodeBlock,
  ImportantNote,
  LearningObjective,
  SuccessNote,
  TutorialContent,
  WarningNote,
} from '@/examples/shared/TutorialComponents.styles'

import EffectDependencyDemo from './EffectDependencyDemo'
import ErrorBoundaryDemo from './ErrorBoundaryDemo'
import LoadingStatesDemo from './LoadingStatesDemo'
import UseEffectBasicsDemo from './UseEffectBasicsDemo'

/**
 * Chapter 2: Promise Patterns in React
 * Complete tutorial content focusing on React-specific async patterns
 */
function Chapter02Content() {
  return (
    <TutorialContent>
      <h1>Promise Patterns in React</h1>

      <LearningObjective>
        By the end of this chapter, you will understand:
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li>How to use useEffect for async operations</li>
          <li>Managing loading states in React components</li>
          <li>Proper cleanup of async operations</li>
          <li>Effect dependencies and when effects re-run</li>
          <li>Error boundaries for async error handling</li>
          <li>Common pitfalls and how to avoid them</li>
        </ul>
      </LearningObjective>

      <h2>useEffect and Async Operations</h2>

      <p>
        React's <code>useEffect</code> hook is the primary way to handle side
        effects in functional components, including asynchronous operations like
        API calls. However, there are important patterns and pitfalls to
        understand when combining useEffect with Promises.
      </p>

      <ImportantNote>
        <strong>Key Rule:</strong> Never make the useEffect callback function
        async directly. The useEffect callback should either return nothing
        (undefined) or a cleanup function. Async functions return Promises,
        which can cause issues.
      </ImportantNote>

      <h3>Basic useEffect with Async Operations</h3>

      <p>
        Here's the correct pattern for using async operations inside useEffect:
      </p>

      <CodeBlock>
        {`// ❌ DON'T do this - async useEffect callback
useEffect(async () => {
  const data = await fetchData()
  setData(data)
}, [])

// ✅ DO this - async function inside useEffect
useEffect(() => {
  const fetchDataAsync = async () => {
    try {
      const data = await fetchData()
      setData(data)
    } catch (error) {
      setError(error.message)
    }
  }
  
  fetchDataAsync()
}, [])`}
      </CodeBlock>

      <UseEffectBasicsDemo />

      <h2>Managing Loading States</h2>

      <p>
        Proper loading state management is crucial for good user experience.
        Users should always know when something is happening, especially during
        network requests.
      </p>

      <SuccessNote>
        <strong>Best Practice:</strong> Always provide visual feedback during
        async operations. This includes loading indicators, progress bars, or
        skeleton screens.
      </SuccessNote>

      <h3>Loading State Patterns</h3>

      <p>
        Here are common patterns for managing loading states with async
        operations:
      </p>

      <CodeBlock>
        {`const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  fetchData()
}, [])`}
      </CodeBlock>

      <LoadingStatesDemo />

      <h2>Effect Dependencies and Re-execution</h2>

      <p>
        Understanding when effects re-run is crucial for avoiding infinite loops
        and ensuring your async operations behave correctly.
      </p>

      <WarningNote>
        <strong>Common Pitfall:</strong> Forgetting to include dependencies can
        lead to stale closures, while including too many dependencies can cause
        unnecessary re-fetching.
      </WarningNote>

      <h3>Dependency Array Rules</h3>

      <ul>
        <li>
          <strong>No dependency array:</strong> Effect runs after every render
        </li>
        <li>
          <strong>Empty array []:</strong> Effect runs only once after initial
          render
        </li>
        <li>
          <strong>With dependencies [dep1, dep2]:</strong> Effect runs when any
          dependency changes
        </li>
      </ul>

      <CodeBlock>
        {`// Runs after every render - usually not what you want
useEffect(() => {
  fetchUserData(userId)
})

// Runs once on mount - good for initial data loading
useEffect(() => {
  fetchInitialData()
}, [])

// Runs when userId changes - good for dependent data
useEffect(() => {
  fetchUserData(userId)
}, [userId])`}
      </CodeBlock>

      <EffectDependencyDemo />

      <h2>Cleanup and Cancellation</h2>

      <p>
        When components unmount or dependencies change, ongoing async operations
        should be cleaned up to prevent memory leaks and "can't perform a React
        state update on unmounted component" warnings.
      </p>

      <h3>AbortController Pattern</h3>

      <CodeBlock>
        {`useEffect(() => {
  const controller = new AbortController()
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data', {
        signal: controller.signal
      })
      const data = await response.json()
      setData(data)
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error.message)
      }
    }
  }
  
  fetchData()
  
  // Cleanup function - runs when effect is cleaned up
  return () => {
    controller.abort()
  }
}, [])

// Boolean flag pattern (alternative)
useEffect(() => {
  let isMounted = true
  
  const fetchData = async () => {
    const data = await apiCall()
    if (isMounted) {
      setData(data)
    }
  }
  
  fetchData()
  
  return () => {
    isMounted = false
  }
}, [])`}
      </CodeBlock>

      <h2>Error Boundaries for Async Errors</h2>

      <p>
        Error boundaries are React components that catch JavaScript errors
        anywhere in their child component tree. However, they don't catch errors
        in async operations directly.
      </p>

      <ImportantNote>
        Error boundaries only catch errors during rendering, in lifecycle
        methods, and in constructors. They do NOT catch errors in event
        handlers, async operations, or during server-side rendering.
      </ImportantNote>

      <h3>Handling Async Errors</h3>

      <p>
        For async errors, you need to catch them in your async functions and
        update component state, which can then trigger error boundaries if
        needed:
      </p>

      <CodeBlock>
        {`// Custom hook for error handling
function useAsyncError() {
  const [, setError] = useState()
  return (error) => {
    setError(() => {
      throw error
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
        // This will trigger error boundary
        throwAsyncError(error)
      }
    }
    
    fetchData()
  }, [throwAsyncError])
}`}
      </CodeBlock>

      <ErrorBoundaryDemo />

      <h2>Common Patterns and Best Practices</h2>

      <h3>1. Data Fetching Pattern</h3>

      <CodeBlock>
        {`function useApiData(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const controller = new AbortController()
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(url, {
          signal: controller.signal
        })
        
        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    
    return () => controller.abort()
  }, [url])
  
  return { data, loading, error }
}`}
      </CodeBlock>

      <h3>2. Debounced Search Pattern</h3>

      <CodeBlock>
        {`function useSearch(searchTerm, delay = 300) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (!searchTerm) {
      setResults([])
      return
    }
    
    const timeoutId = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchAPI(searchTerm)
        setResults(data)
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, delay)
    
    return () => clearTimeout(timeoutId)
  }, [searchTerm, delay])
  
  return { results, loading }
}`}
      </CodeBlock>

      <h3>3. Retry Pattern</h3>

      <CodeBlock>
        {`function useRetryableAsync(asyncFn, maxRetries = 3) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  
  const execute = async () => {
    setLoading(true)
    setError(null)
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await asyncFn()
        setData(result)
        setRetryCount(0)
        return
      } catch (err) {
        if (attempt === maxRetries) {
          setError(err.message)
          setRetryCount(attempt + 1)
        } else {
          // Wait before retry with exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          )
        }
      }
    }
    
    setLoading(false)
  }
  
  return { data, loading, error, retryCount, execute }
}`}
      </CodeBlock>

      <SuccessNote>
        <strong>Chapter Summary:</strong> You've learned how to properly
        integrate Promises with React components using useEffect, manage loading
        and error states, handle cleanup, and implement common async patterns.
        These patterns form the foundation for building robust React
        applications with asynchronous operations.
      </SuccessNote>

      <h2>Next Steps</h2>

      <p>
        In the next chapter, we'll dive deeper into modern async/await syntax
        and learn how to convert Promise-based code to use async/await patterns
        effectively.
      </p>
    </TutorialContent>
  )
}

export default Chapter02Content
