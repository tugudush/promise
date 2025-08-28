import {
  ImportantNote,
  LearningObjective,
  SuccessNote,
  TutorialContent,
} from '@/examples/shared'

import CodeSyntaxHighlighter from '../shared/SyntaxHighlighter'

/**
 * Chapter 6: React Hooks and Async Patterns
 * Complete tutorial content covering useEffect patterns, custom hooks, and advanced hook combinations
 */
function Chapter06Content() {
  return (
    <TutorialContent>
      <h1>Chapter 6: React Hooks and Async Patterns</h1>

      <LearningObjective>
        By the end of this chapter, you will understand:
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li>Proper async patterns in useEffect hooks</li>
          <li>How to build custom hooks for async operations</li>
          <li>Advanced hook combinations for complex async workflows</li>
          <li>State management strategies for async operations</li>
          <li>Cleanup and cancellation patterns</li>
        </ul>
      </LearningObjective>

      <p>
        Learn how to effectively use React hooks with asynchronous operations.
        Master custom hooks, proper useEffect patterns, and advanced hook
        combinations for complex async workflows.
      </p>

      <section>
        <h2>6.1 useEffect and Async Operations</h2>
        <p>
          Understanding how to properly handle async operations within useEffect
          hooks, including cleanup, cancellation, and dependency management.
        </p>

        <h3>The Problem with Async in useEffect</h3>
        <p>
          useEffect cannot directly accept async functions, but we need to
          handle async operations inside effects. Here are the correct patterns:
        </p>

        <CodeSyntaxHighlighter language='typescript'>
          {`// ❌ Wrong - useEffect cannot be async
useEffect(async () => {
  const data = await fetchData()
  setData(data)
}, [])

// ✅ Correct - Define async function inside useEffect
useEffect(() => {
  const fetchDataAsync = async () => {
    try {
      setLoading(true)
      const data = await fetchData()
      setData(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  fetchDataAsync()
}, [])

// ✅ Alternative - Use IIFE (Immediately Invoked Function Expression)
useEffect(() => {
  (async () => {
    try {
      setLoading(true)
      const data = await fetchData()
      setData(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  })()
}, [])`}
        </CodeSyntaxHighlighter>

        <ImportantNote>
          Remember: useEffect itself cannot be async, but you can call async
          functions inside the effect. Always handle errors and loading states
          appropriately.
        </ImportantNote>

        <h3>Cleanup and Cancellation</h3>
        <p>
          It's crucial to handle component unmounting and effect cleanup to
          prevent memory leaks and state updates on unmounted components:
        </p>

        <CodeSyntaxHighlighter language='typescript'>
          {`useEffect(() => {
  const abortController = new AbortController()
  
  const fetchData = async () => {
    try {
      // Pass abort signal to fetch
      const response = await fetch('/api/data', {
        signal: abortController.signal
      })
      
      // Check if component is still mounted
      if (!abortController.signal.aborted) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      // Ignore abort errors
      if (error.name !== 'AbortError') {
        setError(error.message)
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

        {/* Demo component placeholder - will create interactive demo */}
        <div
          style={{
            padding: '2rem',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            margin: '2rem 0',
            textAlign: 'center',
            color: '#64748b',
          }}
        >
          <h4>Interactive Demo: useEffect with Async Operations</h4>
          <p>Interactive demo component will be implemented here</p>
        </div>
      </section>

      <section>
        <h2>6.2 Custom Hooks for Async Logic</h2>
        <p>
          Extract reusable async logic into custom hooks for better code
          organization and reusability across components.
        </p>

        <h3>Building a useFetch Hook</h3>
        <p>
          A custom hook that encapsulates common async data fetching patterns:
        </p>

        <CodeSyntaxHighlighter language='typescript'>
          {`function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const abortController = new AbortController()
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(url, {
          signal: abortController.signal
        })
        
        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
        }
        
        const result = await response.json()
        
        if (!abortController.signal.aborted) {
          setData(result)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error instanceof Error ? error.message : 'Unknown error')
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }
    
    fetchData()
    
    return () => {
      abortController.abort()
    }
  }, [url])
  
  return { data, loading, error }
}

// Usage in component
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useFetch<User>(\`/api/users/\${userId}\`)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>No user found</div>
  
  return <div>Hello, {user.name}!</div>
}`}
        </CodeSyntaxHighlighter>

        {/* Demo component placeholder */}
        <div
          style={{
            padding: '2rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            margin: '2rem 0',
            textAlign: 'center',
            color: '#0369a1',
          }}
        >
          <h4>Interactive Demo: Custom useFetch Hook</h4>
          <p>
            Interactive demo showing custom hooks in action will be implemented
            here
          </p>
        </div>

        <h3>useAsync Hook Pattern</h3>
        <p>
          A more flexible async hook that separates the async operation from the
          trigger:
        </p>

        <CodeSyntaxHighlighter language='typescript'>
          {`function useAsync<T, Args extends any[]>(
  asyncFn: (...args: Args) => Promise<T>
) {
  const [state, setState] = useState<{
    data: T | null
    loading: boolean
    error: string | null
  }>({
    data: null,
    loading: false,
    error: null
  })
  
  const execute = useCallback(async (...args: Args) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const data = await asyncFn(...args)
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [asyncFn])
  
  return {
    ...state,
    execute
  }
}

// Usage
function SearchComponent() {
  const { data, loading, error, execute } = useAsync(searchUsers)
  
  const handleSearch = (query: string) => {
    execute(query)
  }
  
  return (
    <div>
      <SearchInput onSearch={handleSearch} />
      {loading && <div>Searching...</div>}
      {error && <div>Error: {error}</div>}
      {data && <UserList users={data} />}
    </div>
  )
}`}
        </CodeSyntaxHighlighter>
      </section>

      <section>
        <h2>6.3 Advanced Hook Patterns</h2>
        <p>
          Combine multiple hooks for sophisticated async workflows and
          optimizations.
        </p>

        <h3>useCallback with Async Functions</h3>
        <p>
          Memoize async functions to prevent unnecessary re-renders and effect
          re-runs:
        </p>

        <CodeSyntaxHighlighter language='typescript'>
          {`function ProductList({ categoryId }: { categoryId: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  
  // Memoize the async function to prevent effect re-runs
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(\`/api/products?category=\${categoryId}\`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }, [categoryId]) // Re-create only when categoryId changes
  
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts]) // Safe to include fetchProducts in dependencies
  
  const handleRefresh = useCallback(() => {
    fetchProducts()
  }, [fetchProducts])
  
  return (
    <div>
      <button onClick={handleRefresh} disabled={loading}>
        Refresh
      </button>
      {loading ? <div>Loading...</div> : <ProductGrid products={products} />}
    </div>
  )
}`}
        </CodeSyntaxHighlighter>

        {/* Demo component placeholder */}
        <div
          style={{
            padding: '2rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '8px',
            margin: '2rem 0',
            textAlign: 'center',
            color: '#166534',
          }}
        >
          <h4>Interactive Demo: Advanced Hook Patterns</h4>
          <p>
            Interactive demo showing complex hook combinations will be
            implemented here
          </p>
        </div>

        <h3>Complex Async State Management</h3>
        <p>
          For complex async workflows, consider using useReducer for better
          state management:
        </p>

        <CodeSyntaxHighlighter language='typescript'>
          {`type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: string | null
  lastFetch: Date | null
}

type AsyncAction<T> = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_ERROR'; error: string }
  | { type: 'RESET' }

function asyncReducer<T>(
  state: AsyncState<T>, 
  action: AsyncAction<T>
): AsyncState<T> {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return {
        data: action.payload,
        loading: false,
        error: null,
        lastFetch: new Date()
      }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.error }
    case 'RESET':
      return { data: null, loading: false, error: null, lastFetch: null }
    default:
      return state
  }
}

function useAsyncReducer<T>(asyncFn: () => Promise<T>) {
  const [state, dispatch] = useReducer(asyncReducer<T>, {
    data: null,
    loading: false,
    error: null,
    lastFetch: null
  })
  
  const execute = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })
    
    try {
      const data = await asyncFn()
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      dispatch({ type: 'FETCH_ERROR', error: errorMessage })
    }
  }, [asyncFn])
  
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])
  
  return { ...state, execute, reset }
}`}
        </CodeSyntaxHighlighter>

        <SuccessNote>
          <strong>Key Takeaways:</strong>
          <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
            <li>
              Never make useEffect itself async - create async functions inside
            </li>
            <li>Always handle cleanup with AbortController or cleanup flags</li>
            <li>Extract reusable async logic into custom hooks</li>
            <li>Use useCallback to memoize async functions in dependencies</li>
            <li>Consider useReducer for complex async state management</li>
            <li>Handle loading states, errors, and edge cases consistently</li>
          </ul>
        </SuccessNote>
      </section>
    </TutorialContent>
  )
}

export default Chapter06Content
