import { useState } from 'react'

import { CodeSyntaxHighlighter } from '@/examples/shared'

function CodeReviewDemo() {
  const [selectedReviewType, setSelectedReviewType] =
    useState<string>('patterns')

  const reviewSections = {
    patterns: {
      title: 'Async Pattern Review',
      items: [
        {
          pattern: 'Promise.all() for Parallel Operations',
          good: `// ✅ GOOD: Parallel execution
const loadDashboardData = async () => {
  const [userData, feedData, notificationData] = await Promise.all([
    fetchUser(),     // ~500ms
    fetchFeeds(),    // ~1200ms  
    fetchNotifications() // ~300ms
  ])
  
  // Total time: ~1200ms (max of all requests)
  return { userData, feedData, notificationData }
}`,
          bad: `// ❌ BAD: Sequential execution
const loadDashboardData = async () => {
  const userData = await fetchUser()         // ~500ms
  const feedData = await fetchFeeds()        // ~1200ms
  const notificationData = await fetchNotifications() // ~300ms
  
  // Total time: ~2000ms (sum of all requests)
  return { userData, feedData, notificationData }
}`,
          explanation:
            'Use Promise.all() for independent async operations to reduce total loading time.',
        },
        {
          pattern: 'Error Handling with Graceful Degradation',
          good: `// ✅ GOOD: Graceful error handling
const useFeeds = () => {
  const [feeds, setFeeds] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadFeeds = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const feedData = await aggregateFeeds()
      setFeeds(feedData)
    } catch (err) {
      setError(err.message)
      // Fallback to cached data
      setFeeds(getCachedFeeds())
    } finally {
      setIsLoading(false)
    }
  }
  
  return { feeds, error, isLoading, loadFeeds }
}`,
          bad: `// ❌ BAD: No error handling
const useFeeds = () => {
  const [feeds, setFeeds] = useState<Post[]>([])
  
  const loadFeeds = async () => {
    // What happens if this throws?
    const feedData = await aggregateFeeds()
    setFeeds(feedData)
  }
  
  return { feeds, loadFeeds }
}`,
          explanation:
            'Always handle async errors and provide fallback mechanisms for better UX.',
        },
      ],
    },
    performance: {
      title: 'Performance Review',
      items: [
        {
          pattern: 'Optimistic Updates',
          good: `// ✅ GOOD: Optimistic updates with rollback
const useOptimisticPost = () => {
  const [posts, setPosts] = useState<Post[]>([])
  
  const createPost = async (content: string) => {
    // 1. Create optimistic post
    const optimisticPost = { id: \`temp-\${Date.now()}\`, content }
    setPosts(prev => [optimisticPost, ...prev])
    
    try {
      // 2. Submit to server
      const realPost = await api.createPost(content)
      
      // 3. Replace optimistic with real
      setPosts(prev => prev.map(p => 
        p.id === optimisticPost.id ? realPost : p
      ))
    } catch (error) {
      // 4. Rollback on error
      setPosts(prev => prev.filter(p => p.id !== optimisticPost.id))
      throw error
    }
  }
  
  return { posts, createPost }
}`,
          bad: `// ❌ BAD: No optimistic updates
const usePost = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [isCreating, setIsCreating] = useState(false)
  
  const createPost = async (content: string) => {
    setIsCreating(true)
    
    try {
      // User waits for server response before seeing their post
      const newPost = await api.createPost(content)
      setPosts(prev => [newPost, ...prev])
    } finally {
      setIsCreating(false)
    }
  }
  
  return { posts, createPost, isCreating }
}`,
          explanation:
            'Optimistic updates provide instant feedback and better perceived performance.',
        },
        {
          pattern: 'Memory Leak Prevention',
          good: `// ✅ GOOD: Cleanup async operations
const useAsyncData = () => {
  const [data, setData] = useState(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  const fetchData = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()
    
    try {
      const response = await fetch('/api/data', {
        signal: abortControllerRef.current.signal
      })
      const result = await response.json()
      setData(result)
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error)
      }
    }
  }, [])
  
  useEffect(() => {
    fetchData()
    
    return () => {
      // Cleanup on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchData])
  
  return { data, fetchData }
}`,
          bad: `// ❌ BAD: Potential memory leaks
const useAsyncData = () => {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/data')
      const result = await response.json()
      // Component might be unmounted, but we still call setData
      setData(result)
    }
    
    fetchData()
    // No cleanup function
  }, [])
  
  return { data }
}`,
          explanation:
            'Always cancel pending async operations to prevent memory leaks and race conditions.',
        },
      ],
    },
    testing: {
      title: 'Testing Review',
      items: [
        {
          pattern: 'Async Component Testing',
          good: `// ✅ GOOD: Comprehensive async testing
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

describe('AsyncComponent', () => {
  it('handles loading, success, and error states', async () => {
    const mockFetch = vi.fn()
    
    // Test loading state
    mockFetch.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: 'test' }), 100))
    )
    
    render(<AsyncComponent fetch={mockFetch} />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    // Test success state
    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument()
    })
    
    // Test error state
    mockFetch.mockRejectedValue(new Error('API Error'))
    
    fireEvent.click(screen.getByText('Refresh'))
    
    await waitFor(() => {
      expect(screen.getByText('Error: API Error')).toBeInTheDocument()
    })
  })

  it('handles race conditions', async () => {
    let resolveFirst: (value: any) => void
    let resolveSecond: (value: any) => void
    
    const firstPromise = new Promise(resolve => { resolveFirst = resolve })
    const secondPromise = new Promise(resolve => { resolveSecond = resolve })
    
    const mockFetch = vi.fn()
      .mockReturnValueOnce(firstPromise)
      .mockReturnValueOnce(secondPromise)
    
    render(<AsyncComponent fetch={mockFetch} />)
    
    // Trigger two rapid requests
    fireEvent.click(screen.getByText('Load Data'))
    fireEvent.click(screen.getByText('Load Data'))
    
    // Resolve second promise first (simulating race condition)
    resolveSecond({ data: 'second' })
    await waitFor(() => {
      expect(screen.getByText('second')).toBeInTheDocument()
    })
    
    // Resolve first promise - should be ignored
    resolveFirst({ data: 'first' })
    
    // Give time for potential state update
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // Should still show 'second', not 'first'
    expect(screen.getByText('second')).toBeInTheDocument()
    expect(screen.queryByText('first')).not.toBeInTheDocument()
  })
})`,
          bad: `// ❌ BAD: Incomplete async testing
describe('AsyncComponent', () => {
  it('loads data', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ data: 'test' })
    
    render(<AsyncComponent fetch={mockFetch} />)
    
    // Missing: loading state test
    // Missing: error state test
    // Missing: race condition test
    
    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument()
    })
    
    // Only tests happy path
  })
})`,
          explanation:
            'Test all async states: loading, success, error, and race conditions.',
        },
      ],
    },
    security: {
      title: 'Security Review',
      items: [
        {
          pattern: 'Secure Token Management',
          good: `// ✅ GOOD: Secure JWT handling
const useAuth = () => {
  const [token, setToken] = useState<string | null>(null)
  const tokenExpiryRef = useRef<NodeJS.Timeout | null>(null)
  
  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include' // HttpOnly cookie
      })
      
      if (!response.ok) throw new Error('Token refresh failed')
      
      const { accessToken, expiresIn } = await response.json()
      setToken(accessToken)
      
      // Schedule automatic refresh before expiry
      if (tokenExpiryRef.current) {
        clearTimeout(tokenExpiryRef.current)
      }
      
      tokenExpiryRef.current = setTimeout(() => {
        refreshToken()
      }, (expiresIn - 60) * 1000) // Refresh 1 minute before expiry
      
    } catch (error) {
      setToken(null)
      // Redirect to login
    }
  }, [])
  
  return { token, refreshToken }
}`,
          bad: `// ❌ BAD: Insecure token handling
const useAuth = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token') // Stored in localStorage
  )
  
  const login = async (credentials: LoginCredentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    
    const { token } = await response.json()
    
    // Store sensitive token in localStorage
    localStorage.setItem('token', token)
    setToken(token)
    
    // No token refresh mechanism
    // No expiry handling
  }
  
  return { token, login }
}`,
          explanation:
            'Use HttpOnly cookies for token storage and implement automatic refresh mechanisms.',
        },
        {
          pattern: 'Input Validation and Sanitization',
          good: `// ✅ GOOD: Proper validation and sanitization
const usePostCreation = () => {
  const [error, setError] = useState<string | null>(null)
  
  const createPost = async (content: string) => {
    setError(null)
    
    // Client-side validation
    if (!content.trim()) {
      setError('Post content cannot be empty')
      return
    }
    
    if (content.length > 280) {
      setError('Post content too long (max 280 characters)')
      return
    }
    
    // Sanitize content
    const sanitizedContent = content
      .trim()
      .replace(/<script[^>]*>.*?<\\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify({ 
          content: sanitizedContent,
          timestamp: Date.now()
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create post')
      }
      
      return await response.json()
    } catch (error) {
      setError(error.message)
      throw error
    }
  }
  
  return { createPost, error }
}`,
          bad: `// ❌ BAD: No validation or sanitization
const usePostCreation = () => {
  const createPost = async (content: string) => {
    // No validation - empty content allowed
    // No length limits
    // No sanitization - XSS vulnerability
    
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // No CSRF protection
      body: JSON.stringify({ content }) // Raw, unsanitized content
    })
    
    return await response.json()
  }
  
  return { createPost }
}`,
          explanation:
            'Always validate and sanitize user input, implement CSRF protection, and handle errors securely.',
        },
      ],
    },
  }

  const currentSection =
    reviewSections[selectedReviewType as keyof typeof reviewSections]

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div
        style={{
          background: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginBottom: '1.5rem',
        }}
      >
        <p>
          <strong>Code Review</strong> is crucial for maintaining code quality
          and sharing knowledge. This section provides a comprehensive review of
          async patterns, performance optimizations, testing strategies, and
          security considerations.
        </p>
      </div>

      {/* Review Type Selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {Object.keys(reviewSections).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedReviewType(type)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor:
                  selectedReviewType === type ? '#dc2626' : '#f3f4f6',
                color: selectedReviewType === type ? 'white' : '#1f2937',
                border: '1px solid',
                borderColor:
                  selectedReviewType === type ? '#dc2626' : '#d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontWeight: selectedReviewType === type ? '600' : '500',
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Review Content */}
      <div
        style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: '#dc2626',
            color: 'white',
            padding: '1rem',
          }}
        >
          <h4 style={{ margin: 0, color: 'white' }}>{currentSection.title}</h4>
        </div>

        <div style={{ padding: '0' }}>
          {currentSection.items.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '2rem',
                borderBottom:
                  index < currentSection.items.length - 1
                    ? '1px solid #e2e8f0'
                    : 'none',
              }}
            >
              <h5 style={{ color: '#dc2626', marginBottom: '1rem' }}>
                {item.pattern}
              </h5>

              <p
                style={{
                  marginBottom: '1.5rem',
                  color: '#374151',
                  fontStyle: 'italic',
                }}
              >
                {item.explanation}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                {/* Good Example */}
                <div>
                  <div
                    style={{
                      background: '#dcfce7',
                      color: '#166534',
                      padding: '0.5rem',
                      borderRadius: '4px 4px 0 0',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    ✅ RECOMMENDED
                  </div>
                  <CodeSyntaxHighlighter
                    language='typescript'
                    customStyle={{
                      margin: 0,
                      borderRadius: '0 0 4px 4px',
                      border: '2px solid #16a34a',
                    }}
                  >
                    {item.good}
                  </CodeSyntaxHighlighter>
                </div>

                {/* Bad Example */}
                <div>
                  <div
                    style={{
                      background: '#fee2e2',
                      color: '#991b1b',
                      padding: '0.5rem',
                      borderRadius: '4px 4px 0 0',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    ❌ AVOID
                  </div>
                  <CodeSyntaxHighlighter
                    language='typescript'
                    customStyle={{
                      margin: 0,
                      borderRadius: '0 0 4px 4px',
                      border: '2px solid #dc2626',
                    }}
                  >
                    {item.bad}
                  </CodeSyntaxHighlighter>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Checklist */}
      <div
        style={{
          background: '#fef7cd',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #d97706',
          marginTop: '2rem',
        }}
      >
        <h4>📋 Code Review Checklist</h4>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          {[
            {
              category: 'Async Patterns',
              items: [
                'Promise.all() used for parallel operations',
                'Proper error handling with try/catch',
                'No unhandled promise rejections',
                'Async functions properly await results',
              ],
            },
            {
              category: 'Performance',
              items: [
                'Optimistic updates implemented',
                'No memory leaks from unhandled promises',
                'AbortController used for cancellation',
                'Proper cleanup in useEffect',
              ],
            },
            {
              category: 'User Experience',
              items: [
                'Loading states shown during async operations',
                'Error messages are user-friendly',
                'Retry mechanisms available',
                'Graceful degradation on failures',
              ],
            },
            {
              category: 'Security',
              items: [
                'Input validation and sanitization',
                'CSRF tokens included in requests',
                'Secure token storage (HttpOnly cookies)',
                'No sensitive data in console logs',
              ],
            },
          ].map((section, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                border: '1px solid #d97706',
                borderRadius: '6px',
                padding: '1rem',
              }}
            >
              <h5 style={{ color: '#78350f', marginBottom: '0.5rem' }}>
                {section.category}
              </h5>
              <ul style={{ fontSize: '0.875rem', marginLeft: '1rem' }}>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} style={{ marginBottom: '0.25rem' }}>
                    <span style={{ marginRight: '0.5rem' }}>☑️</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment Readiness */}
      <div
        style={{
          background: '#e0e7ff',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #6366f1',
          marginTop: '2rem',
        }}
      >
        <h4>🚀 Deployment Readiness</h4>
        <p>Before deploying to production, ensure:</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginTop: '1rem',
          }}
        >
          <div>
            <h5>Technical Requirements</h5>
            <ul style={{ marginLeft: '1rem' }}>
              <li>All tests pass (unit, integration, e2e)</li>
              <li>Code coverage {`>`} 80%</li>
              <li>Bundle size optimized</li>
              <li>Performance benchmarks met</li>
              <li>Security vulnerabilities scanned</li>
            </ul>
          </div>
          <div>
            <h5>Monitoring & Observability</h5>
            <ul style={{ marginLeft: '1rem' }}>
              <li>Error tracking configured</li>
              <li>Performance monitoring active</li>
              <li>Async operation metrics tracked</li>
              <li>User experience monitoring</li>
              <li>Alerting rules configured</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeReviewDemo
