import { useCallback, useEffect, useRef, useState } from 'react'

import { CodeSyntaxHighlighter } from '@/examples/shared'
import { simulateApiCall } from '@/utils/async-helpers'

interface Post {
  id: string
  platform: 'twitter' | 'instagram' | 'linkedin'
  author: string
  content: string
  timestamp: number
  likes: number
  shares: number
  image?: string
}

interface User {
  id: string
  name: string
  avatar: string
  email: string
}

interface NotificationMessage {
  id: string
  type: 'like' | 'comment' | 'mention' | 'follow'
  message: string
  timestamp: number
  read: boolean
}

function SocialMediaDashboardDemo() {
  const [activeTab, setActiveTab] = useState<string>('implementation')
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [notifications, setNotifications] = useState<NotificationMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected'
  >('disconnected')

  // WebSocket simulation
  const websocketRef = useRef<NodeJS.Timeout | null>(null)
  const [newPostContent, setNewPostContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  // Simulate user authentication
  const authenticateUser = async (): Promise<User> => {
    await simulateApiCall(1000)
    return {
      id: '1',
      name: 'John Doe',
      avatar: '👤',
      email: 'john@example.com',
    }
  }

  // Simulate feed aggregation with Promise.all()
  const aggregateFeeds = async (): Promise<Post[]> => {
    const feedSources = [
      simulateApiCall(800).then(() => [
        {
          id: 'tw1',
          platform: 'twitter' as const,
          author: 'Tech News',
          content:
            'Breaking: New JavaScript async patterns revolutionize web development!',
          timestamp: Date.now() - 3600000,
          likes: 42,
          shares: 12,
        },
        {
          id: 'tw2',
          platform: 'twitter' as const,
          author: 'Web Dev Tips',
          content:
            'Pro tip: Always handle Promise rejections to avoid unhandled promise warnings!',
          timestamp: Date.now() - 7200000,
          likes: 28,
          shares: 8,
        },
      ]),
      simulateApiCall(1200).then(() => [
        {
          id: 'ig1',
          platform: 'instagram' as const,
          author: 'Design Studio',
          content: 'New UI design showcasing async loading states 🎨',
          timestamp: Date.now() - 1800000,
          likes: 156,
          shares: 23,
          image: '🎨',
        },
      ]),
      simulateApiCall(600).then(() => [
        {
          id: 'li1',
          platform: 'linkedin' as const,
          author: 'Career Coach',
          content:
            'How mastering async JavaScript patterns can boost your career prospects',
          timestamp: Date.now() - 5400000,
          likes: 89,
          shares: 34,
        },
      ]),
    ]

    const results = await Promise.all(feedSources)
    return results.flat().sort((a, b) => b.timestamp - a.timestamp)
  }

  // Simulate WebSocket connection for real-time notifications
  const connectWebSocket = useCallback(() => {
    setConnectionStatus('connecting')

    // Simulate connection delay
    setTimeout(() => {
      setConnectionStatus('connected')

      // Simulate incoming notifications every 10 seconds
      websocketRef.current = setInterval(() => {
        const notificationTypes = [
          'like',
          'comment',
          'mention',
          'follow',
        ] as const
        const messages = [
          'Someone liked your post',
          'New comment on your post',
          'You were mentioned in a post',
          'New follower!',
        ]

        const randomType =
          notificationTypes[
            Math.floor(Math.random() * notificationTypes.length)
          ]
        const randomMessage = messages[notificationTypes.indexOf(randomType)]

        const notification: NotificationMessage = {
          id: `notif-${Date.now()}`,
          type: randomType,
          message: randomMessage,
          timestamp: Date.now(),
          read: false,
        }

        setNotifications((prev) => [notification, ...prev].slice(0, 10))
      }, 10000)
    }, 1500)
  }, [])

  // Load initial data
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Parallel loading of user data and feeds
      const [userData, feedData] = await Promise.all([
        authenticateUser(),
        aggregateFeeds(),
      ])

      setUser(userData)
      setPosts(feedData)
      connectWebSocket()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load dashboard data'
      )
    } finally {
      setIsLoading(false)
    }
  }, [connectWebSocket])

  // Optimistic post creation
  const createPost = async () => {
    if (!newPostContent.trim()) return

    setIsPosting(true)
    const optimisticPost: Post = {
      id: `temp-${Date.now()}`,
      platform: 'twitter',
      author: user?.name || 'You',
      content: newPostContent,
      timestamp: Date.now(),
      likes: 0,
      shares: 0,
    }

    // Optimistic update - add post immediately
    setPosts((prev) => [optimisticPost, ...prev])
    setNewPostContent('')

    try {
      // Simulate API call
      await simulateApiCall(2000)

      // Update with real post ID from server
      setPosts((prev) =>
        prev.map((post) =>
          post.id === optimisticPost.id
            ? { ...post, id: `real-${Date.now()}` }
            : post
        )
      )
    } catch {
      // Remove optimistic post on error
      setPosts((prev) => prev.filter((post) => post.id !== optimisticPost.id))
      setError('Failed to create post')
    } finally {
      setIsPosting(false)
    }
  }

  useEffect(() => {
    loadDashboardData()

    return () => {
      if (websocketRef.current) {
        clearInterval(websocketRef.current)
      }
    }
  }, [loadDashboardData, connectWebSocket])

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Tab Navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'implementation', label: 'Live Implementation' },
            { id: 'patterns', label: 'Async Patterns' },
            { id: 'architecture', label: 'Code Architecture' },
            { id: 'testing', label: 'Testing Strategy' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: activeTab === tab.id ? '#dc2626' : '#f3f4f6',
                color: activeTab === tab.id ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Implementation Demo */}
      {activeTab === 'implementation' && (
        <div>
          <h4>🚀 Live Social Media Dashboard</h4>
          <p>
            This interactive demo showcases all the async patterns we've learned
            throughout the course, implemented in a real-world application.
          </p>

          {/* Dashboard Header */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              {user ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>{user.avatar}</span>
                  <span>Welcome, {user.name}!</span>
                </div>
              ) : (
                <span>Loading user...</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor:
                      connectionStatus === 'connected'
                        ? '#10b981'
                        : connectionStatus === 'connecting'
                          ? '#f59e0b'
                          : '#ef4444',
                  }}
                />
                <span
                  style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}
                >
                  {connectionStatus}
                </span>
              </div>

              <div
                style={{
                  background: '#dc2626',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                }}
              >
                {notifications.filter((n) => !n.read).length} new
              </div>
            </div>
          </div>

          {/* Post Creation */}
          <div
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <h5>Create New Post</h5>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind? (This demonstrates optimistic updates)"
              style={{
                width: '100%',
                height: '80px',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                resize: 'vertical',
              }}
            />
            <button
              onClick={createPost}
              disabled={isPosting || !newPostContent.trim()}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: isPosting ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isPosting ? 'not-allowed' : 'pointer',
              }}
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>

          {/* Feed Display */}
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
                background: '#3b82f6',
                color: 'white',
                padding: '1rem',
              }}
            >
              <h5 style={{ margin: 0 }}>
                Aggregated Feed ({posts.length} posts)
              </h5>
              <p
                style={{
                  margin: '0.25rem 0 0 0',
                  opacity: 0.9,
                  fontSize: '0.875rem',
                }}
              >
                Loaded using Promise.all() for parallel feed requests
              </p>
            </div>

            {isLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div>🔄 Loading feeds from multiple platforms...</div>
              </div>
            ) : error ? (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#dc2626',
                  background: '#fef2f2',
                }}
              >
                ❌ Error: {error}
                <br />
                <button
                  onClick={loadDashboardData}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {posts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #e2e8f0',
                      opacity: post.id.startsWith('temp-') ? 0.7 : 1,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          background:
                            post.platform === 'twitter'
                              ? '#dbeafe'
                              : post.platform === 'instagram'
                                ? '#fce7f3'
                                : '#ecfdf5',
                          color:
                            post.platform === 'twitter'
                              ? '#1d4ed8'
                              : post.platform === 'instagram'
                                ? '#be185d'
                                : '#059669',
                        }}
                      >
                        {post.platform}
                      </span>
                      <strong>{post.author}</strong>
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {new Date(post.timestamp).toLocaleTimeString()}
                      </span>
                      {post.id.startsWith('temp-') && (
                        <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>
                          (Posting...)
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0' }}>{post.content}</p>
                    {post.image && (
                      <div style={{ fontSize: '2rem', margin: '0.5rem 0' }}>
                        {post.image}
                      </div>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        fontSize: '0.875rem',
                        color: '#6b7280',
                      }}
                    >
                      <span>👍 {post.likes}</span>
                      <span>🔄 {post.shares}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Panel */}
          {notifications.length > 0 && (
            <div
              style={{
                background: '#fef7cd',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                marginTop: '1rem',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  padding: '0.75rem',
                }}
              >
                <h5 style={{ margin: 0 }}>
                  Real-time Notifications (WebSocket)
                </h5>
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid #f59e0b',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{notification.message}</span>
                    <span style={{ fontSize: '0.75rem', color: '#92400e' }}>
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Async Patterns Tab */}
      {activeTab === 'patterns' && (
        <div>
          <h4>🔧 Async Patterns Implementation</h4>

          <div style={{ marginBottom: '2rem' }}>
            <h5>1. Parallel Feed Loading with Promise.all()</h5>
            <CodeSyntaxHighlighter language='typescript'>
              {`const aggregateFeeds = async (): Promise<Post[]> => {
  const feedSources = [
    fetchTwitterFeed(),    // ~800ms
    fetchInstagramFeed(),  // ~1200ms  
    fetchLinkedInFeed()    // ~600ms
  ]

  // All requests execute in parallel - total time ~1200ms (not 2600ms)
  const results = await Promise.all(feedSources)
  
  return results
    .flat()
    .sort((a, b) => b.timestamp - a.timestamp)
}`}
            </CodeSyntaxHighlighter>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h5>2. Optimistic Updates for Responsive UI</h5>
            <CodeSyntaxHighlighter language='typescript'>
              {`const createPost = async () => {
  // 1. Create optimistic post immediately
  const optimisticPost: Post = {
    id: \`temp-\${Date.now()}\`,
    content: newPostContent,
    timestamp: Date.now()
  }
  
  // 2. Update UI immediately (optimistic)
  setPosts(prev => [optimisticPost, ...prev])
  setNewPostContent('')

  try {
    // 3. Send to server in background
    const realPost = await submitPost(optimisticPost)
    
    // 4. Replace optimistic post with real one
    setPosts(prev => prev.map(post => 
      post.id === optimisticPost.id ? realPost : post
    ))
  } catch (error) {
    // 5. Remove optimistic post on failure
    setPosts(prev => prev.filter(post => post.id !== optimisticPost.id))
    showError('Failed to create post')
  }
}`}
            </CodeSyntaxHighlighter>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h5>3. WebSocket Connection Management</h5>
            <CodeSyntaxHighlighter language='typescript'>
              {`const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5
  
  const connect = useCallback(() => {
    if (socket?.readyState === WebSocket.OPEN) return
    
    setConnectionState('connecting')
    const ws = new WebSocket(url)
    
    ws.onopen = () => {
      setConnectionState('connected')
      setSocket(ws)
      reconnectAttempts.current = 0
    }
    
    ws.onclose = () => {
      setConnectionState('disconnected')
      setSocket(null)
      
      // Automatic reconnection with exponential backoff
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.pow(2, reconnectAttempts.current) * 1000
        reconnectAttempts.current++
        setTimeout(connect, delay)
      }
    }
    
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data)
      setNotifications(prev => [notification, ...prev])
    }
  }, [url, socket])
  
  return { socket, connectionState, connect }
}`}
            </CodeSyntaxHighlighter>
          </div>
        </div>
      )}

      {/* Architecture Tab */}
      {activeTab === 'architecture' && (
        <div>
          <h4>🏗️ Application Architecture</h4>

          <div style={{ marginBottom: '2rem' }}>
            <h5>Component Structure</h5>
            <CodeSyntaxHighlighter language='bash'>
              {`src/
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── Dashboard.styles.ts
│   │   └── Dashboard.hooks.ts       # Custom async hooks
│   │
│   ├── PostCreator/
│   │   ├── PostCreator.tsx
│   │   └── useOptimisticPost.ts     # Optimistic updates
│   │
│   └── FeedAggregator/
│       ├── FeedAggregator.tsx
│       └── useFeedAggregation.ts    # Promise.all() logic
│
├── hooks/
│   ├── useAuth.ts                   # Authentication state
│   ├── useWebSocket.ts              # Real-time communication
│   ├── useFeedData.ts              # Data fetching
│   └── useAsync.ts                  # Generic async state
│
├── services/
│   ├── api.ts                       # HTTP client
│   ├── websocket.ts                # WebSocket client
│   └── storage.ts                   # Local storage
│
└── types/
    ├── api.ts                       # API types
    ├── user.ts                      # User types  
    └── posts.ts                     # Post types`}
            </CodeSyntaxHighlighter>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h5>Data Flow Architecture</h5>
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1.5rem',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '1rem',
                  textAlign: 'center',
                }}
              >
                <div>
                  <h6>1. User Action</h6>
                  <div
                    style={{
                      background: '#dbeafe',
                      padding: '1rem',
                      borderRadius: '4px',
                    }}
                  >
                    <p>Button Click</p>
                    <p>Form Submit</p>
                    <p>Page Load</p>
                  </div>
                </div>
                <div>
                  <h6>2. Async Operation</h6>
                  <div
                    style={{
                      background: '#fef3c7',
                      padding: '1rem',
                      borderRadius: '4px',
                    }}
                  >
                    <p>API Request</p>
                    <p>Promise.all()</p>
                    <p>WebSocket Message</p>
                  </div>
                </div>
                <div>
                  <h6>3. State Update</h6>
                  <div
                    style={{
                      background: '#dcfce7',
                      padding: '1rem',
                      borderRadius: '4px',
                    }}
                  >
                    <p>Component State</p>
                    <p>Context Update</p>
                    <p>Cache Invalidation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testing Tab */}
      {activeTab === 'testing' && (
        <div>
          <h4>🧪 Testing Async Components</h4>

          <div style={{ marginBottom: '2rem' }}>
            <h5>Testing Async Operations</h5>
            <CodeSyntaxHighlighter language='typescript'>
              {`import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import SocialMediaDashboard from './SocialMediaDashboard'

// Mock async API calls
vi.mock('@/services/api', () => ({
  fetchFeeds: vi.fn(),
  createPost: vi.fn()
}))

describe('SocialMediaDashboard', () => {
  it('loads feeds in parallel using Promise.all()', async () => {
    const mockFeeds = [
      { id: '1', platform: 'twitter', content: 'Test post' }
    ]
    
    vi.mocked(fetchFeeds).mockResolvedValue(mockFeeds)
    
    render(<SocialMediaDashboard />)
    
    // Check loading state
    expect(screen.getByText('Loading feeds...')).toBeInTheDocument()
    
    // Wait for async operation to complete
    await waitFor(() => {
      expect(screen.getByText('Test post')).toBeInTheDocument()
    })
    
    // Verify Promise.all() was used (all feeds loaded in parallel)
    expect(fetchFeeds).toHaveBeenCalledTimes(1)
  })

  it('handles optimistic updates correctly', async () => {
    const mockCreatePost = vi.mocked(createPost)
    mockCreatePost.mockResolvedValue({ id: 'new-post', content: 'New post' })
    
    render(<SocialMediaDashboard />)
    
    const input = screen.getByPlaceholderText('What\\'s on your mind?')
    const submitButton = screen.getByText('Post')
    
    // Type in the input
    fireEvent.change(input, { target: { value: 'My new post' } })
    fireEvent.click(submitButton)
    
    // Check optimistic update (post appears immediately)
    expect(screen.getByText('My new post')).toBeInTheDocument()
    expect(screen.getByText('(Posting...)')).toBeInTheDocument()
    
    // Wait for API call to complete
    await waitFor(() => {
      expect(screen.queryByText('(Posting...)')).not.toBeInTheDocument()
    })
    
    expect(mockCreatePost).toHaveBeenCalledWith({
      content: 'My new post'
    })
  })

  it('handles WebSocket connection states', async () => {
    render(<SocialMediaDashboard />)
    
    // Initially disconnected
    expect(screen.getByText('disconnected')).toBeInTheDocument()
    
    // Should show connecting state
    await waitFor(() => {
      expect(screen.getByText('connecting')).toBeInTheDocument()
    })
    
    // Should eventually connect
    await waitFor(() => {
      expect(screen.getByText('connected')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('handles error states gracefully', async () => {
    const mockError = new Error('Network error')
    vi.mocked(fetchFeeds).mockRejectedValue(mockError)
    
    render(<SocialMediaDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument()
      expect(screen.getByText('Retry')).toBeInTheDocument()
    })
    
    // Test retry functionality
    fireEvent.click(screen.getByText('Retry'))
    expect(fetchFeeds).toHaveBeenCalledTimes(2)
  })
})`}
            </CodeSyntaxHighlighter>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h5>Integration Testing with MSW</h5>
            <CodeSyntaxHighlighter language='typescript'>
              {`import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Set up MSW server for API mocking
const server = setupServer(
  // Mock feed aggregation endpoint
  http.get('/api/feeds', () => {
    return HttpResponse.json({
      twitter: [{ id: '1', content: 'Twitter post' }],
      instagram: [{ id: '2', content: 'Instagram post' }],
      linkedin: [{ id: '3', content: 'LinkedIn post' }]
    })
  }),
  
  // Mock post creation
  http.post('/api/posts', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      id: \`post-\${Date.now()}\`,
      ...body,
      timestamp: Date.now()
    })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Dashboard Integration', () => {
  it('integrates all async patterns in real workflow', async () => {
    render(<App />)
    
    // 1. Test initial data loading (Promise.all)
    await waitFor(() => {
      expect(screen.getByText('Twitter post')).toBeInTheDocument()
      expect(screen.getByText('Instagram post')).toBeInTheDocument()
      expect(screen.getByText('LinkedIn post')).toBeInTheDocument()
    })
    
    // 2. Test optimistic post creation
    const input = screen.getByPlaceholderText('What\\'s on your mind?')
    fireEvent.change(input, { target: { value: 'Integration test post' } })
    fireEvent.click(screen.getByText('Post'))
    
    // 3. Verify optimistic update
    expect(screen.getByText('Integration test post')).toBeInTheDocument()
    
    // 4. Wait for server confirmation
    await waitFor(() => {
      expect(screen.queryByText('(Posting...)')).not.toBeInTheDocument()
    })
    
    // 5. Test WebSocket simulation
    await waitFor(() => {
      expect(screen.getByText('connected')).toBeInTheDocument()
    })
  })
})`}
            </CodeSyntaxHighlighter>
          </div>

          <div
            style={{
              background: '#e0e7ff',
              border: '1px solid #6366f1',
              borderRadius: '8px',
              padding: '1.5rem',
            }}
          >
            <h5>🎯 Testing Best Practices for Async Components</h5>
            <ul style={{ marginLeft: '1rem' }}>
              <li>
                <strong>Test loading states</strong> - Verify spinners and
                loading indicators
              </li>
              <li>
                <strong>Test error states</strong> - Ensure graceful error
                handling
              </li>
              <li>
                <strong>Test optimistic updates</strong> - Check immediate UI
                feedback
              </li>
              <li>
                <strong>Test retry mechanisms</strong> - Verify recovery from
                failures
              </li>
              <li>
                <strong>Test WebSocket connections</strong> - Mock real-time
                functionality
              </li>
              <li>
                <strong>Test race conditions</strong> - Handle rapid user
                interactions
              </li>
              <li>
                <strong>Test cleanup</strong> - Prevent memory leaks and hanging
                promises
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default SocialMediaDashboardDemo
