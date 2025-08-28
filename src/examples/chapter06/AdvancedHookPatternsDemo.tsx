import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import { DemoButton, DemoContainer, DemoSection } from '@/examples/shared'
import { simulateApiCall } from '@/utils/async-helpers'

import CodeSyntaxHighlighter from '../shared/SyntaxHighlighter'

// Complex async state management with useReducer
type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: string | null
  lastFetch: Date | null
  retryCount: number
}

type AsyncAction<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: T }
  | { type: 'FETCH_ERROR'; error: string }
  | { type: 'RETRY' }
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
        lastFetch: new Date(),
        retryCount: 0,
      }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.error }
    case 'RETRY':
      return { ...state, retryCount: state.retryCount + 1, error: null }
    case 'RESET':
      return {
        data: null,
        loading: false,
        error: null,
        lastFetch: null,
        retryCount: 0,
      }
    default:
      return state
  }
}

// Custom hook using useReducer for complex state
function useAsyncReducer<T>(asyncFn: () => Promise<T>) {
  const [state, dispatch] = useReducer(asyncReducer<T>, {
    data: null,
    loading: false,
    error: null,
    lastFetch: null,
    retryCount: 0,
  })

  const execute = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })

    try {
      const data = await asyncFn()
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      dispatch({ type: 'FETCH_ERROR', error: errorMessage })
    }
  }, [asyncFn])

  const retry = useCallback(async () => {
    dispatch({ type: 'RETRY' })
    await execute()
  }, [execute])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return { ...state, execute, retry, reset }
}

// Product type for demo
type Product = {
  id: number
  name: string
  category: string
  price: number
}

/**
 * Interactive demo showing advanced hook patterns and combinations
 */
export function AdvancedHookPatternsDemo() {
  const [activeDemo, setActiveDemo] = useState<
    'useCallback' | 'useReducer' | 'combined'
  >('useCallback')
  const [categoryId, setCategoryId] = useState('electronics')

  // Demo 1: useCallback with async functions
  const [products, setProducts] = useState<Product[]>([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Memoized async function to prevent unnecessary re-renders
  const fetchProducts = useCallback(async () => {
    setFetchLoading(true)
    setFetchError(null)

    try {
      await simulateApiCall(1500) // Simulate API delay

      // Mock data based on category
      const mockProducts: Product[] = [
        {
          id: 1,
          name: `${categoryId} Item 1`,
          category: categoryId,
          price: 99.99,
        },
        {
          id: 2,
          name: `${categoryId} Item 2`,
          category: categoryId,
          price: 149.99,
        },
        {
          id: 3,
          name: `${categoryId} Item 3`,
          category: categoryId,
          price: 79.99,
        },
      ]

      setProducts(mockProducts)
    } catch (error) {
      setFetchError(
        error instanceof Error ? error.message : 'Failed to fetch products'
      )
    } finally {
      setFetchLoading(false)
    }
  }, [categoryId])

  // Effect that safely depends on the memoized function
  useEffect(() => {
    if (activeDemo === 'useCallback') {
      fetchProducts()
    }
  }, [fetchProducts, activeDemo])

  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    fetchProducts()
  }, [fetchProducts])

  // Demo 2: useReducer for complex async state
  const complexAsyncFn = useCallback(async () => {
    await simulateApiCall(2000)

    // Randomly fail sometimes to demonstrate retry
    if (Math.random() < 0.3) {
      throw new Error('Random API failure (30% chance)')
    }

    return {
      timestamp: new Date().toISOString(),
      data: 'Complex async operation completed successfully!',
      randomValue: Math.floor(Math.random() * 1000),
    }
  }, [])

  const {
    data: reducerData,
    loading: reducerLoading,
    error: reducerError,
    lastFetch,
    retryCount,
    execute,
    retry,
    reset,
  } = useAsyncReducer(complexAsyncFn)

  // Demo 3: Combined hooks with memoization
  const expensiveComputedValue = useMemo(() => {
    if (!products.length) return null

    return {
      totalProducts: products.length,
      averagePrice:
        products.reduce((sum, p) => sum + p.price, 0) / products.length,
      categoryName: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
    }
  }, [products, categoryId])

  const handleCategoryChange = (newCategory: string) => {
    setCategoryId(newCategory)
  }

  return (
    <DemoSection>
      <h3>Interactive Demo: Advanced Hook Patterns</h3>

      <div style={{ marginBottom: '2rem' }}>
        <h4>Choose Demo:</h4>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <DemoButton
            onClick={() => setActiveDemo('useCallback')}
            style={{
              backgroundColor:
                activeDemo === 'useCallback' ? '#3b82f6' : '#6b7280',
            }}
          >
            useCallback Pattern
          </DemoButton>
          <DemoButton
            onClick={() => setActiveDemo('useReducer')}
            style={{
              backgroundColor:
                activeDemo === 'useReducer' ? '#3b82f6' : '#6b7280',
            }}
          >
            useReducer Pattern
          </DemoButton>
          <DemoButton
            onClick={() => setActiveDemo('combined')}
            style={{
              backgroundColor:
                activeDemo === 'combined' ? '#3b82f6' : '#6b7280',
            }}
          >
            Combined Hooks
          </DemoButton>
        </div>
      </div>

      {activeDemo === 'useCallback' && (
        <DemoContainer>
          <div>
            <h4>useCallback with Async Functions</h4>
            <p>
              Memoizing async functions to prevent unnecessary effect re-runs.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <h5>Select Category:</h5>
              <div
                style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}
              >
                {['electronics', 'clothing', 'books', 'home'].map(
                  (category) => (
                    <DemoButton
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      style={{
                        backgroundColor:
                          categoryId === category ? '#10b981' : '#6b7280',
                        fontSize: '0.875rem',
                        padding: '0.5rem 1rem',
                      }}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </DemoButton>
                  )
                )}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <DemoButton onClick={handleRefresh} disabled={fetchLoading}>
                {fetchLoading ? 'Loading...' : 'Refresh Products'}
              </DemoButton>
            </div>

            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                fontFamily: 'monospace',
              }}
            >
              <div>
                <strong>Category:</strong> {categoryId}
              </div>
              <div>
                <strong>Loading:</strong> {fetchLoading ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Error:</strong> {fetchError || 'None'}
              </div>
              <div>
                <strong>Products:</strong>{' '}
                {products.length ? JSON.stringify(products, null, 2) : 'None'}
              </div>
            </div>
          </div>

          <div>
            <h4>useCallback Implementation:</h4>
            <CodeSyntaxHighlighter language='typescript'>
              {`// Memoize async function to prevent effect re-runs
const fetchProducts = useCallback(async () => {
  setLoading(true)
  try {
    const response = await fetch(\`/api/products?category=\${categoryId}\`)
    const data = await response.json()
    setProducts(data)
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}, [categoryId]) // Re-create only when categoryId changes

// Safe to include in dependencies
useEffect(() => {
  fetchProducts()
}, [fetchProducts])

// Manual refresh handler
const handleRefresh = useCallback(() => {
  fetchProducts()
}, [fetchProducts])`}
            </CodeSyntaxHighlighter>
          </div>
        </DemoContainer>
      )}

      {activeDemo === 'useReducer' && (
        <DemoContainer>
          <div>
            <h4>useReducer for Complex Async State</h4>
            <p>
              Managing complex async state with automatic retry and detailed
              state tracking.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <DemoButton onClick={execute} disabled={reducerLoading}>
                {reducerLoading ? 'Executing...' : 'Execute Operation'}
              </DemoButton>
              {reducerError && (
                <DemoButton onClick={retry} disabled={reducerLoading}>
                  Retry ({retryCount} attempts)
                </DemoButton>
              )}
              <DemoButton onClick={reset}>Reset</DemoButton>
            </div>

            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                fontFamily: 'monospace',
              }}
            >
              <div>
                <strong>Loading:</strong> {reducerLoading ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Data:</strong>{' '}
                {reducerData ? JSON.stringify(reducerData, null, 2) : 'None'}
              </div>
              <div>
                <strong>Error:</strong> {reducerError || 'None'}
              </div>
              <div>
                <strong>Last Fetch:</strong>{' '}
                {lastFetch ? lastFetch.toLocaleTimeString() : 'Never'}
              </div>
              <div>
                <strong>Retry Count:</strong> {retryCount}
              </div>
            </div>
          </div>

          <div>
            <h4>useReducer Implementation:</h4>
            <CodeSyntaxHighlighter language='typescript'>
              {`type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: string | null
  lastFetch: Date | null
  retryCount: number
}

function asyncReducer<T>(state: AsyncState<T>, action: AsyncAction<T>) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return {
        data: action.payload,
        loading: false,
        error: null,
        lastFetch: new Date(),
        retryCount: 0
      }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.error }
    case 'RETRY':
      return { ...state, retryCount: state.retryCount + 1 }
    default:
      return state
  }
}

function useAsyncReducer<T>(asyncFn: () => Promise<T>) {
  const [state, dispatch] = useReducer(asyncReducer<T>, initialState)
  
  const execute = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      const data = await asyncFn()
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', error: error.message })
    }
  }, [asyncFn])
  
  return { ...state, execute }
}`}
            </CodeSyntaxHighlighter>
          </div>
        </DemoContainer>
      )}

      {activeDemo === 'combined' && (
        <DemoContainer>
          <div>
            <h4>Combined Hook Patterns</h4>
            <p>
              Combining useCallback, useMemo, and custom hooks for optimal
              performance.
            </p>

            {expensiveComputedValue && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              >
                <h5>Memoized Computed Values:</h5>
                <div>
                  <strong>Category:</strong>{' '}
                  {expensiveComputedValue.categoryName}
                </div>
                <div>
                  <strong>Total Products:</strong>{' '}
                  {expensiveComputedValue.totalProducts}
                </div>
                <div>
                  <strong>Average Price:</strong> $
                  {expensiveComputedValue.averagePrice.toFixed(2)}
                </div>
              </div>
            )}

            <div>
              <DemoButton onClick={handleRefresh} disabled={fetchLoading}>
                {fetchLoading ? 'Loading...' : 'Load Products'}
              </DemoButton>
            </div>
          </div>

          <div>
            <h4>Combined Pattern:</h4>
            <CodeSyntaxHighlighter language='typescript'>
              {`function ProductList({ categoryId }) {
  // 1. Memoized async function
  const fetchProducts = useCallback(async () => {
    // fetch logic
  }, [categoryId])
  
  // 2. Effect with memoized dependency
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])
  
  // 3. Expensive computation with useMemo
  const stats = useMemo(() => {
    if (!products.length) return null
    return {
      total: products.length,
      avgPrice: products.reduce((sum, p) => sum + p.price, 0) / products.length
    }
  }, [products])
  
  // 4. Memoized event handlers
  const handleRefresh = useCallback(() => {
    fetchProducts()
  }, [fetchProducts])
  
  return (
    <div>
      {stats && <Stats data={stats} />}
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  )
}`}
            </CodeSyntaxHighlighter>
          </div>
        </DemoContainer>
      )}

      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #f59e0b',
        }}
      >
        <h4 style={{ color: '#92400e', marginTop: 0 }}>🚀 Performance Tips:</h4>
        <ul style={{ color: '#92400e', marginBottom: 0 }}>
          <li>
            <strong>useCallback:</strong> Memoize async functions used in
            effects or passed to child components
          </li>
          <li>
            <strong>useMemo:</strong> Memoize expensive computations that depend
            on async data
          </li>
          <li>
            <strong>useReducer:</strong> Better than useState for complex async
            state management
          </li>
          <li>
            <strong>Custom Hooks:</strong> Combine patterns for reusable async
            logic
          </li>
          <li>
            <strong>Dependency Arrays:</strong> Be careful with dependencies to
            avoid infinite loops
          </li>
        </ul>
      </div>
    </DemoSection>
  )
}
