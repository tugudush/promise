import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoOutput,
  DemoSection,
  ExampleTitle,
  ImportantNote,
  StatusIndicator,
  SuccessNote,
} from '@/examples/shared'
import { simulateApiCall } from '@/utils/async-helpers'

interface InfiniteScrollItem {
  id: number
  title: string
  description: string
  timestamp: string
}

/**
 * Demonstrates performance optimization techniques for async operations in React
 * Shows cancellation, memoization, and efficient data loading patterns
 */
function PerformanceOptimizationDemo() {
  const [cancelDemo, setCancelDemo] = useState<'idle' | 'loading' | 'cancelled' | 'success' | 'error'>('idle')
  const [cancelResult, setCancelResult] = useState('')
  const abortControllerRef = useRef<AbortController | null>(null)

  const [memoDemo, setMemoDemo] = useState<'idle' | 'loading' | 'success'>('idle')
  const [searchTerm, setSearchTerm] = useState('react')
  const [searchResults, setSearchResults] = useState<string[]>([])

  const [scrollItems, setScrollItems] = useState<InfiniteScrollItem[]>([])
  const [scrollLoading, setScrollLoading] = useState(false)
  const [scrollPage, setScrollPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Demo 1: Cancellable requests using AbortController
  const startCancellableRequest = async () => {
    setCancelDemo('loading')
    setCancelResult('')
    
    // Create new AbortController for this request
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      // Simulate long-running request with cancellation support
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          if (controller.signal.aborted) {
            reject(new Error('Request was cancelled'))
          } else {
            resolve()
          }
        }, 3000)

        // Listen for cancellation
        controller.signal.addEventListener('abort', () => {
          clearTimeout(timeout)
          reject(new Error('Request was cancelled'))
        })
      })

      if (!controller.signal.aborted) {
        setCancelResult('Long operation completed successfully!')
        setCancelDemo('success')
      }
    } catch (error) {
      if (controller.signal.aborted) {
        setCancelResult('Request was cancelled by user')
        setCancelDemo('cancelled')
      } else {
        setCancelResult(error instanceof Error ? error.message : 'Unknown error')
        setCancelDemo('error')
      }
    } finally {
      abortControllerRef.current = null
    }
  }

  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  // Demo 2: Memoized expensive operations
  const expensiveSearch = useMemo(async () => {
    if (!searchTerm.trim()) return []

    setMemoDemo('loading')
    
    // Simulate expensive search operation
    await simulateApiCall(1500)
    
    const mockResults = [
      `${searchTerm} tutorial`,
      `Advanced ${searchTerm} patterns`,
      `${searchTerm} best practices`,
      `${searchTerm} performance tips`,
      `Building with ${searchTerm}`,
    ]
    
    setMemoDemo('success')
    return mockResults
  }, [searchTerm])

  // Update search results when memoized search completes
  useEffect(() => {
    if (expensiveSearch) {
      expensiveSearch.then(results => {
        setSearchResults(results)
      })
    }
  }, [expensiveSearch])

  // Demo 3: Efficient infinite scroll with pagination
  const loadMoreItems = useCallback(async (page: number) => {
    if (scrollLoading || !hasMore) return

    setScrollLoading(true)

    try {
      await simulateApiCall(800)

      // Simulate pagination - stop after page 5
      if (page > 5) {
        setHasMore(false)
        setScrollLoading(false)
        return
      }

      const newItems: InfiniteScrollItem[] = Array.from({ length: 10 }, (_, i) => ({
        id: (page - 1) * 10 + i,
        title: `Item ${(page - 1) * 10 + i + 1}`,
        description: `Description for item ${(page - 1) * 10 + i + 1}`,
        timestamp: new Date().toLocaleTimeString(),
      }))

      setScrollItems(prev => [...prev, ...newItems])
      setScrollPage(page + 1)
    } catch {
      // Handle error - in production, you might want to show user feedback
      setHasMore(false)
    } finally {
      setScrollLoading(false)
    }
  }, [scrollLoading, hasMore])

  // Load initial items
  useEffect(() => {
    if (scrollItems.length === 0) {
      loadMoreItems(1)
    }
  }, [scrollItems.length, loadMoreItems])

  // Debounced search to avoid excessive API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const resetInfiniteScroll = () => {
    setScrollItems([])
    setScrollPage(1)
    setHasMore(true)
    setScrollLoading(false)
  }

  return (
    <DemoSection>
      <ExampleTitle>Performance Optimization Techniques</ExampleTitle>

      <p>
        Learn advanced techniques for optimizing async operations in React applications,
        including request cancellation, memoization, and efficient data loading patterns.
      </p>

      <ImportantNote>
        <strong>Key Performance Strategies:</strong>
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li><strong>Request Cancellation:</strong> Prevent memory leaks and unnecessary processing</li>
          <li><strong>Memoization:</strong> Cache expensive async computations</li>
          <li><strong>Debouncing:</strong> Reduce API calls for user input</li>
          <li><strong>Efficient Pagination:</strong> Load data incrementally</li>
        </ul>
      </ImportantNote>

      {/* Request Cancellation Demo */}
      <div style={{ marginBottom: '2rem' }}>
        <h4>1. Request Cancellation with AbortController</h4>
        <p>
          Cancel long-running requests to prevent memory leaks and unnecessary processing
          when components unmount or users navigate away.
        </p>

        <DemoContainer>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <DemoButton 
              onClick={startCancellableRequest} 
              disabled={cancelDemo === 'loading'}
            >
              Start Long Request (3s)
            </DemoButton>
            <DemoButton 
              onClick={cancelRequest} 
              disabled={cancelDemo !== 'loading'}
            >
              Cancel Request
            </DemoButton>
          </div>

          <StatusIndicator status={cancelDemo === 'loading' ? 'pending' : cancelDemo === 'success' ? 'fulfilled' : 'rejected'}>
            <strong>Status:</strong> {cancelDemo}
          </StatusIndicator>

          {cancelResult && (
            <DemoOutput>
              {cancelResult}
            </DemoOutput>
          )}
        </DemoContainer>

        <CodeSyntaxHighlighter language="typescript">
          {`// Request cancellation with AbortController
function CancellableRequest() {
  const [loading, setLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const makeRequest = async () => {
    setLoading(true)
    
    // Create new AbortController
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await fetch('/api/data', {
        signal: controller.signal, // Pass abort signal
      })

      if (controller.signal.aborted) return

      const data = await response.json()
      setData(data)
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled')
      } else {
        setError(error)
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  const cancelRequest = () => {
    abortControllerRef.current?.abort()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  return (
    <div>
      <button onClick={makeRequest} disabled={loading}>
        {loading ? 'Loading...' : 'Make Request'}
      </button>
      <button onClick={cancelRequest} disabled={!loading}>
        Cancel
      </button>
    </div>
  )
}`}
        </CodeSyntaxHighlighter>
      </div>

      {/* Memoization Demo */}
      <div style={{ marginBottom: '2rem' }}>
        <h4>2. Memoized Expensive Operations</h4>
        <p>
          Use useMemo and useCallback to cache expensive async operations and
          prevent unnecessary re-computations.
        </p>

        <DemoContainer>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Search term (debounced):
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                width: '200px',
              }}
            />
          </div>

          <StatusIndicator status={memoDemo === 'loading' ? 'pending' : 'fulfilled'}>
            <strong>Search Status:</strong> {memoDemo}
            {debouncedSearchTerm !== searchTerm && (
              <span> | Debouncing...</span>
            )}
          </StatusIndicator>

          {searchResults.length > 0 && (
            <DemoOutput>
              {searchResults.join('\n')}
            </DemoOutput>
          )}
        </DemoContainer>

        <CodeSyntaxHighlighter language="typescript">
          {`// Memoized search with debouncing
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Memoize expensive search operation
  const searchResults = useMemo(async () => {
    if (!debouncedTerm.trim()) return []

    const response = await fetch(\`/api/search?q=\${debouncedTerm}\`)
    return response.json()
  }, [debouncedTerm])

  // Memoized callback for search result processing
  const processResults = useCallback((results: any[]) => {
    return results.map(item => ({
      ...item,
      highlighted: highlightSearchTerm(item.title, debouncedTerm)
    }))
  }, [debouncedTerm])

  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <SearchResults results={searchResults} processor={processResults} />
    </div>
  )
}`}
        </CodeSyntaxHighlighter>
      </div>

      {/* Infinite Scroll Demo */}
      <div>
        <h4>3. Efficient Infinite Scroll</h4>
        <p>
          Implement performant infinite scrolling with proper cleanup and
          memory management for large datasets.
        </p>

        <DemoContainer>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <DemoButton onClick={() => loadMoreItems(scrollPage)} disabled={scrollLoading || !hasMore}>
              Load More Items
            </DemoButton>
            <DemoButton onClick={resetInfiniteScroll}>
              Reset List
            </DemoButton>
          </div>

          <StatusIndicator status={scrollLoading ? 'pending' : 'fulfilled'}>
            <strong>Items:</strong> {scrollItems.length} loaded
            {!hasMore && <span> | No more items</span>}
            {scrollLoading && <span> | Loading...</span>}
          </StatusIndicator>

          <div style={{ 
            maxHeight: '300px', 
            overflow: 'auto', 
            border: '1px solid #d1d5db', 
            borderRadius: '4px',
            padding: '1rem',
          }}>
            {scrollItems.map(item => (
              <div key={item.id} style={{ 
                padding: '0.5rem 0', 
                borderBottom: '1px solid #f3f4f6' 
              }}>
                <strong>{item.title}</strong>
                <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  {item.description}
                </p>
                <small style={{ color: '#9ca3af' }}>{item.timestamp}</small>
              </div>
            ))}
            
            {scrollLoading && (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                Loading more items...
              </div>
            )}
          </div>
        </DemoContainer>

        <CodeSyntaxHighlighter language="typescript">
          {`// Efficient infinite scroll implementation
function InfiniteScrollList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const response = await fetch(\`/api/items?page=\${page}&limit=20\`)
      const newItems = await response.json()

      if (newItems.length === 0) {
        setHasMore(false)
      } else {
        setItems(prev => [...prev, ...newItems])
        setPage(prev => prev + 1)
      }
    } catch (error) {
      console.error('Failed to load items:', error)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])

  // Intersection Observer for automatic loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div>
      {items.map(item => (
        <ItemComponent key={item.id} item={item} />
      ))}
      <div ref={observerRef} />
      {loading && <LoadingSpinner />}
    </div>
  )
}`}
        </CodeSyntaxHighlighter>
      </div>

      <SuccessNote>
        <strong>Pro Tips:</strong>
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li>Always cleanup AbortControllers on component unmount</li>
          <li>Use useMemo for expensive computations, useCallback for event handlers</li>
          <li>Implement proper debouncing for user input (300-500ms is optimal)</li>
          <li>Consider virtualization for very large lists (react-window/react-virtualized)</li>
          <li>Monitor memory usage and implement cleanup strategies</li>
        </ul>
      </SuccessNote>
    </DemoSection>
  )
}

export default PerformanceOptimizationDemo
