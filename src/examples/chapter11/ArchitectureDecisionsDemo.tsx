import { useState } from 'react'

import { CodeSyntaxHighlighter } from '@/examples/shared'

function ArchitectureDecisionsDemo() {
  const [selectedDecision, setSelectedDecision] = useState<string>('state')

  const architectureDecisions = {
    state: {
      title: 'State Management Architecture',
      decision: 'Hybrid approach with local state + Context API',
      alternatives: [
        'Redux Toolkit Query (Complex setup)',
        'Zustand (Learning curve)',
        'Pure React Context (Performance issues)',
        'Local state only (Poor data sharing)',
      ],
      reasoning: 'Balance between simplicity and scalability',
      asyncImplications: [
        'Local state for component-specific async operations',
        'Context API for shared async state (auth, user profile)',
        'Custom hooks to encapsulate async logic',
        'Error boundaries for async error handling',
      ],
    },
    data: {
      title: 'Data Fetching Strategy',
      decision: 'Custom hooks + Promise.all() for parallel requests',
      alternatives: [
        'SWR (External dependency)',
        'React Query (Overkill for our scope)',
        'Axios (Unnecessary HTTP client)',
        'Native fetch only (Less convenient)',
      ],
      reasoning: 'Leverages learned patterns without external complexity',
      asyncImplications: [
        'useFetch hook for individual API calls',
        'useFeeds hook for aggregated data loading',
        'Promise.all() for parallel feed requests',
        'Built-in retry and error handling',
      ],
    },
    realtime: {
      title: 'Real-time Communication',
      decision: 'WebSocket with connection management',
      alternatives: [
        'Server-Sent Events (One-way only)',
        'Socket.io (Heavyweight)',
        'Polling (Inefficient)',
        'Push notifications only (Limited functionality)',
      ],
      reasoning: 'Native WebSocket provides full-duplex communication',
      asyncImplications: [
        'useWebSocket hook for connection management',
        'Automatic reconnection with exponential backoff',
        'Message queuing during disconnection',
        'Connection state in React context',
      ],
    },
    error: {
      title: 'Error Handling Strategy',
      decision: 'Multi-layered error boundaries + toast notifications',
      alternatives: [
        'Global error handler only (Poor UX)',
        'Alert-based errors (Disruptive)',
        'Console logging only (No user feedback)',
        'Redirect to error page (Heavy-handed)',
      ],
      reasoning: 'Graceful degradation with user-friendly feedback',
      asyncImplications: [
        'Component-level error boundaries',
        'Async error recovery mechanisms',
        'User-friendly error messages',
        'Offline state detection and handling',
      ],
    },
    performance: {
      title: 'Performance Optimization',
      decision: 'Lazy loading + code splitting + caching',
      alternatives: [
        'Load everything upfront (Slow initial load)',
        'No caching (Repeated requests)',
        'Heavy bundling (Large downloads)',
        'No optimization (Poor user experience)',
      ],
      reasoning: 'Optimal user experience with progressive loading',
      asyncImplications: [
        'React.lazy() for route-based code splitting',
        'Dynamic imports for heavy components',
        'Service Worker for background caching',
        'Optimistic updates for perceived performance',
      ],
    },
  }

  const currentDecision =
    architectureDecisions[
      selectedDecision as keyof typeof architectureDecisions
    ]

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
          <strong>Architecture decisions</strong> shape how we implement async
          patterns throughout our application. Each decision impacts
          performance, maintainability, and user experience.
        </p>
      </div>

      {/* Decision Type Selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {Object.keys(architectureDecisions).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedDecision(type)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor:
                  selectedDecision === type ? '#059669' : '#f3f4f6',
                color: selectedDecision === type ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Decision Display */}
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
            background: '#059669',
            color: 'white',
            padding: '1rem',
          }}
        >
          <h4 style={{ margin: 0 }}>{currentDecision.title}</h4>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
            <strong>Decision:</strong> {currentDecision.decision}
          </p>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h5>Why This Decision?</h5>
            <p
              style={{
                background: '#ecfdf5',
                padding: '1rem',
                borderRadius: '6px',
                border: '1px solid #059669',
                margin: 0,
              }}
            >
              {currentDecision.reasoning}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
            }}
          >
            {/* Alternatives Considered */}
            <div>
              <h5>Alternatives Considered</h5>
              <ul style={{ marginLeft: '1rem' }}>
                {currentDecision.alternatives.map((alternative, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: '0.5rem',
                      color: '#6b7280',
                    }}
                  >
                    {alternative}
                  </li>
                ))}
              </ul>
            </div>

            {/* Async Implications */}
            <div>
              <h5>Async Implementation Details</h5>
              <ul style={{ marginLeft: '1rem' }}>
                {currentDecision.asyncImplications.map((implication, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: '0.5rem',
                      color: '#059669',
                      fontWeight: 500,
                    }}
                  >
                    {implication}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Example */}
      <div style={{ marginTop: '2rem' }}>
        <h4>Implementation Example: {currentDecision.title}</h4>

        {selectedDecision === 'state' && (
          <CodeSyntaxHighlighter language='typescript'>
            {`// State Management Architecture Implementation
            
// 1. Local state for component-specific async operations
function PostEditor() {
  const [content, setContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handlePost = async () => {
    setIsPosting(true)
    setError(null)
    
    try {
      await submitPost(content)
      setContent('') // Reset form
    } catch (err) {
      setError(err.message)
    } finally {
      setIsPosting(false)
    }
  }
  
  return (/* JSX */)
}

// 2. Context API for shared async state
interface AuthContextType {
  user: User | null
  login: (credentials: Credentials) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  error: string | null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    user: null,
    isLoading: false,
    error: null
  })
  
  const login = async (credentials: Credentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const user = await authenticate(credentials)
      setState(prev => ({ ...prev, user, isLoading: false }))
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        isLoading: false 
      }))
    }
  }
  
  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Custom hooks to encapsulate async logic
function useFeeds() {
  const [feeds, setFeeds] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const loadFeeds = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const allFeeds = await Promise.all([
        fetchTwitterFeed(),
        fetchInstagramFeed(),
        fetchLinkedInFeed()
      ])
      
      const combinedFeeds = allFeeds.flat()
        .sort((a, b) => b.timestamp - a.timestamp)
        
      setFeeds(combinedFeeds)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  return { feeds, isLoading, error, loadFeeds }
}`}
          </CodeSyntaxHighlighter>
        )}

        {selectedDecision === 'realtime' && (
          <CodeSyntaxHighlighter language='typescript'>
            {`// WebSocket Connection Management Implementation

interface UseWebSocketOptions {
  url: string
  reconnectAttempts?: number
  reconnectInterval?: number
}

function useWebSocket({ url, reconnectAttempts = 5, reconnectInterval = 1000 }: UseWebSocketOptions) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [connectionState, setConnectionState] = useState<'connecting' | 'open' | 'closed'>('closed')
  const [messageQueue, setMessageQueue] = useState<string[]>([])
  const reconnectCount = useRef(0)
  
  const connect = useCallback(() => {
    if (socket?.readyState === WebSocket.OPEN) return
    
    setConnectionState('connecting')
    const ws = new WebSocket(url)
    
    ws.onopen = () => {
      setConnectionState('open')
      setSocket(ws)
      reconnectCount.current = 0
      
      // Send queued messages
      messageQueue.forEach(message => ws.send(message))
      setMessageQueue([])
    }
    
    ws.onclose = () => {
      setConnectionState('closed')
      setSocket(null)
      
      // Automatic reconnection with exponential backoff
      if (reconnectCount.current < reconnectAttempts) {
        const delay = reconnectInterval * Math.pow(2, reconnectCount.current)
        reconnectCount.current++
        
        setTimeout(connect, delay)
      }
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
    
  }, [url, reconnectAttempts, reconnectInterval, messageQueue, socket])
  
  const sendMessage = useCallback((message: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(message)
    } else {
      // Queue messages when disconnected
      setMessageQueue(prev => [...prev, message])
    }
  }, [socket])
  
  useEffect(() => {
    connect()
    
    return () => {
      socket?.close()
    }
  }, [connect])
  
  return { socket, connectionState, sendMessage }
}`}
          </CodeSyntaxHighlighter>
        )}
      </div>

      {/* Architecture Decision Record (ADR) Template */}
      <div
        style={{
          background: '#fef3c7',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #f59e0b',
          marginTop: '2rem',
        }}
      >
        <h4>📋 Architecture Decision Record (ADR) Template</h4>
        <p>Document your decisions for future reference:</p>
        <ol style={{ marginLeft: '1.5rem' }}>
          <li>
            <strong>Title:</strong> Brief description of the decision
          </li>
          <li>
            <strong>Context:</strong> What problem are we solving?
          </li>
          <li>
            <strong>Decision:</strong> What approach did we choose?
          </li>
          <li>
            <strong>Rationale:</strong> Why this approach?
          </li>
          <li>
            <strong>Alternatives:</strong> What else did we consider?
          </li>
          <li>
            <strong>Consequences:</strong> Trade-offs and implications
          </li>
        </ol>
      </div>
    </div>
  )
}

export default ArchitectureDecisionsDemo
