import { useCallback, useEffect, useState } from 'react'

import { DemoButton, DemoContainer, DemoSection } from '@/examples/shared'
import {
  simulateApiCall,
  simulateUnreliableApiCall,
} from '@/utils/async-helpers'

import CodeSyntaxHighlighter from '../shared/SyntaxHighlighter'

// Custom useFetch hook implementation
function useFetch<T>(url: string, shouldFetch: boolean = true) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shouldFetch) return

    const abortController = new AbortController()

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Simulate API call based on URL
        let result: T
        if (url.includes('users')) {
          result = { id: 1, name: 'John Doe', email: 'john@example.com' } as T
        } else if (url.includes('posts')) {
          result = {
            id: 1,
            title: 'Sample Post',
            content: 'This is a sample post',
          } as T
        } else {
          result = { message: 'Data from ' + url } as T
        }

        // Simulate network delay
        await simulateApiCall(1500)

        if (!abortController.signal.aborted) {
          setData(result)
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
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
  }, [url, shouldFetch])

  return { data, loading, error }
}

// Custom useAsync hook implementation
function useAsync<T, Args extends unknown[]>(
  asyncFn: (...args: Args) => Promise<T>
) {
  const [state, setState] = useState<{
    data: T | null
    loading: boolean
    error: string | null
  }>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: Args) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const data = await asyncFn(...args)
        setState({ data, loading: false, error: null })
        return data
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        setState({ data: null, loading: false, error: errorMessage })
        throw error
      }
    },
    [asyncFn]
  )

  return {
    ...state,
    execute,
  }
}

/**
 * Interactive demo showing custom hooks for async operations
 */
export function CustomHooksDemo() {
  const [activeDemo, setActiveDemo] = useState<'useFetch' | 'useAsync'>(
    'useFetch'
  )
  const [fetchUrl, setFetchUrl] = useState('/api/users/1')
  const [shouldFetch, setShouldFetch] = useState(false)

  // Demo 1: useFetch hook
  const {
    data: fetchData,
    loading: fetchLoading,
    error: fetchError,
  } = useFetch(fetchUrl, shouldFetch)

  // Demo 2: useAsync hook
  const {
    data: asyncData,
    loading: asyncLoading,
    error: asyncError,
    execute,
  } = useAsync(simulateUnreliableApiCall)

  const handleStartFetch = () => {
    setShouldFetch(true)
  }

  const handleStopFetch = () => {
    setShouldFetch(false)
  }

  const handleUrlChange = (newUrl: string) => {
    setFetchUrl(newUrl)
    setShouldFetch(false) // Reset fetch state
  }

  const handleAsyncExecute = () => {
    execute(0.8) // 80% success rate
  }

  return (
    <DemoSection>
      <h3>Interactive Demo: Custom Hooks for Async Logic</h3>

      <div style={{ marginBottom: '2rem' }}>
        <h4>Choose Demo:</h4>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <DemoButton
            onClick={() => setActiveDemo('useFetch')}
            style={{
              backgroundColor:
                activeDemo === 'useFetch' ? '#3b82f6' : '#6b7280',
            }}
          >
            useFetch Hook
          </DemoButton>
          <DemoButton
            onClick={() => setActiveDemo('useAsync')}
            style={{
              backgroundColor:
                activeDemo === 'useAsync' ? '#3b82f6' : '#6b7280',
            }}
          >
            useAsync Hook
          </DemoButton>
        </div>
      </div>

      {activeDemo === 'useFetch' && (
        <DemoContainer>
          <div>
            <h4>useFetch Hook Demo</h4>
            <p>
              A declarative hook that automatically fetches data when the URL
              changes.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <h5>Select API Endpoint:</h5>
              <div
                style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}
              >
                <DemoButton
                  onClick={() => handleUrlChange('/api/users/1')}
                  style={{
                    backgroundColor: fetchUrl.includes('users')
                      ? '#10b981'
                      : '#6b7280',
                    fontSize: '0.875rem',
                    padding: '0.5rem 1rem',
                  }}
                >
                  User Data
                </DemoButton>
                <DemoButton
                  onClick={() => handleUrlChange('/api/posts/1')}
                  style={{
                    backgroundColor: fetchUrl.includes('posts')
                      ? '#10b981'
                      : '#6b7280',
                    fontSize: '0.875rem',
                    padding: '0.5rem 1rem',
                  }}
                >
                  Post Data
                </DemoButton>
                <DemoButton
                  onClick={() => handleUrlChange('/api/settings')}
                  style={{
                    backgroundColor: fetchUrl.includes('settings')
                      ? '#10b981'
                      : '#6b7280',
                    fontSize: '0.875rem',
                    padding: '0.5rem 1rem',
                  }}
                >
                  Settings Data
                </DemoButton>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <DemoButton
                onClick={handleStartFetch}
                disabled={fetchLoading || shouldFetch}
              >
                {fetchLoading ? 'Fetching...' : 'Start Fetch'}
              </DemoButton>
              <DemoButton onClick={handleStopFetch} disabled={!shouldFetch}>
                Cancel
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
                <strong>URL:</strong> {fetchUrl}
              </div>
              <div>
                <strong>Loading:</strong> {fetchLoading ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Should Fetch:</strong> {shouldFetch ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Data:</strong>{' '}
                {fetchData ? JSON.stringify(fetchData, null, 2) : 'None'}
              </div>
              <div>
                <strong>Error:</strong> {fetchError || 'None'}
              </div>
            </div>
          </div>

          <div>
            <h4>useFetch Implementation:</h4>
            <CodeSyntaxHighlighter language='typescript'>
              {`function useFetch<T>(url: string, shouldFetch = true) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shouldFetch) return

    const abortController = new AbortController()
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(url, {
          signal: abortController.signal
        })
        
        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}\`)
        }
        
        const result = await response.json()
        
        if (!abortController.signal.aborted) {
          setData(result)
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          setError(error.message)
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
  }, [url, shouldFetch])

  return { data, loading, error }
}

// Usage in component
const { data, loading, error } = useFetch<User>('/api/users/1')`}
            </CodeSyntaxHighlighter>
          </div>
        </DemoContainer>
      )}

      {activeDemo === 'useAsync' && (
        <DemoContainer>
          <div>
            <h4>useAsync Hook Demo</h4>
            <p>
              An imperative hook that lets you manually trigger async
              operations.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <DemoButton onClick={handleAsyncExecute} disabled={asyncLoading}>
                {asyncLoading ? 'Executing...' : 'Execute Async Operation'}
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
                <strong>Loading:</strong> {asyncLoading ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Data:</strong> {asyncData || 'None'}
              </div>
              <div>
                <strong>Error:</strong> {asyncError || 'None'}
              </div>
            </div>
          </div>

          <div>
            <h4>useAsync Implementation:</h4>
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
      const errorMessage = error.message || 'Unknown error'
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [asyncFn])
  
  return { ...state, execute }
}

// Usage in component
const { data, loading, error, execute } = useAsync(apiCall)

// Trigger manually
const handleClick = () => {
  execute(params)
}`}
            </CodeSyntaxHighlighter>
          </div>
        </DemoContainer>
      )}

      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #10b981',
        }}
      >
        <h4 style={{ color: '#065f46', marginTop: 0 }}>
          ✅ Custom Hook Benefits:
        </h4>
        <ul style={{ color: '#065f46', marginBottom: 0 }}>
          <li>
            <strong>Reusability:</strong> Use the same logic across multiple
            components
          </li>
          <li>
            <strong>Separation of Concerns:</strong> Keep async logic separate
            from UI logic
          </li>
          <li>
            <strong>Consistent State Management:</strong> Standardized loading,
            data, and error states
          </li>
          <li>
            <strong>Automatic Cleanup:</strong> Built-in cleanup prevents memory
            leaks
          </li>
          <li>
            <strong>Testing:</strong> Easier to test hooks in isolation
          </li>
        </ul>
      </div>
    </DemoSection>
  )
}
