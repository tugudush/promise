import { useCallback, useMemo, useState } from 'react'

import { CodeSyntaxHighlighter } from '@/examples/shared'
import {
  DemoButton,
  DemoContainer,
  DemoOutput,
  DemoSection,
  ExampleTitle,
  StatusIndicator,
} from '@/examples/shared/TutorialComponents.styles'

// Types for our API examples
interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

interface NewsArticle {
  id: number
  title: string
  content: string
  author: string
  publishedAt: string
}

interface WebSocketMessage {
  type: 'connected' | 'disconnected' | 'update'
  message?: string
  data?: {
    timestamp: string
    userCount: number
    activeConnections: number
  }
}

// Mock API responses
const mockUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Carol Brown', email: 'carol@example.com' },
]

const mockNews: NewsArticle[] = [
  {
    id: 1,
    title: 'React 19 Released',
    content: 'React 19 introduces new features for async operations...',
    author: 'React Team',
    publishedAt: '2024-12-01T10:00:00Z',
  },
  {
    id: 2,
    title: 'JavaScript Performance Tips',
    content: 'Learn how to optimize your async operations...',
    author: 'JS Expert',
    publishedAt: '2024-11-28T15:30:00Z',
  },
]

// Simulate different API patterns
class ApiClient {
  // RESTful API pattern
  async getUsers(): Promise<User[]> {
    await this.delay(800)
    if (Math.random() > 0.8) {
      throw new Error('[EDUCATIONAL DEMO] Network error: Failed to fetch users')
    }
    return mockUsers
  }

  async getUser(id: number): Promise<User> {
    await this.delay(500)
    const user = mockUsers.find((u) => u.id === id)
    if (!user) {
      throw new Error(`[EDUCATIONAL DEMO] User with id ${id} not found`)
    }
    return user
  }

  // News feed pattern with pagination
  async getNews(
    page = 1,
    limit = 10
  ): Promise<{ articles: NewsArticle[]; hasMore: boolean }> {
    await this.delay(600)
    const start = (page - 1) * limit
    const articles = mockNews.slice(start, start + limit)
    return {
      articles,
      hasMore: start + limit < mockNews.length,
    }
  }

  // WebSocket simulation
  createWebSocketConnection(onMessage: (data: WebSocketMessage) => void): {
    close: () => void
  } {
    let intervalId: NodeJS.Timeout
    let isConnected = true

    // Simulate connection delay
    setTimeout(() => {
      if (!isConnected) return

      onMessage({ type: 'connected', message: 'WebSocket connected' })

      // Send periodic updates
      intervalId = setInterval(() => {
        if (!isConnected) return

        onMessage({
          type: 'update',
          data: {
            timestamp: new Date().toISOString(),
            userCount: Math.floor(Math.random() * 100) + 50,
            activeConnections: Math.floor(Math.random() * 10) + 1,
          },
        })
      }, 2000)
    }, 300)

    return {
      close: () => {
        isConnected = false
        if (intervalId) clearInterval(intervalId)
        onMessage({ type: 'disconnected', message: 'WebSocket disconnected' })
      },
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export function ApiIntegrationDemo() {
  const [users, setUsers] = useState<User[]>([])
  const [news, setNews] = useState<NewsArticle[]>([])
  const [wsMessages, setWsMessages] = useState<WebSocketMessage[]>([])
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [wsConnection, setWsConnection] = useState<{
    close: () => void
  } | null>(null)

  const apiClient = useMemo(() => new ApiClient(), [])

  const handleError = (operation: string, error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown error'
    setErrors((prev) => ({ ...prev, [operation]: message }))
    setLoading((prev) => ({ ...prev, [operation]: false }))
  }

  const clearError = (operation: string) => {
    setErrors((prev) => ({ ...prev, [operation]: '' }))
  }

  const fetchUsers = useCallback(async () => {
    setLoading((prev) => ({ ...prev, users: true }))
    clearError('users')

    try {
      const userData = await apiClient.getUsers()
      setUsers(userData)
    } catch (error) {
      handleError('users', error)
    } finally {
      setLoading((prev) => ({ ...prev, users: false }))
    }
  }, [apiClient])

  const fetchNews = useCallback(async () => {
    setLoading((prev) => ({ ...prev, news: true }))
    clearError('news')

    try {
      const newsData = await apiClient.getNews(1, 10)
      setNews(newsData.articles)
    } catch (error) {
      handleError('news', error)
    } finally {
      setLoading((prev) => ({ ...prev, news: false }))
    }
  }, [apiClient])

  const connectWebSocket = useCallback(() => {
    if (wsConnection) {
      wsConnection.close()
      setWsConnection(null)
      return
    }

    setWsMessages([])
    const connection = apiClient.createWebSocketConnection((message) => {
      setWsMessages((prev) => [...prev, message].slice(-10)) // Keep last 10 messages
    })

    setWsConnection(connection)
  }, [apiClient, wsConnection])

  return (
    <DemoContainer>
      <ExampleTitle>8.1 API Integration Patterns</ExampleTitle>

      <DemoSection>
        <h4>RESTful API Integration</h4>
        <p>
          Modern React applications need robust patterns for consuming REST
          APIs. Here's an example of a production-ready API client:
        </p>

        <CodeSyntaxHighlighter language='typescript' showLanguageLabel>
          {`// Production API Client
class ApiClient {
  private baseUrl: string
  private retryAttempts = 3
  
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let lastError: Error
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)
        
        const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
        }
        
        return await response.json()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        if (attempt === this.retryAttempts) break
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        )
      }
    }
    
    throw lastError
  }
}`}
        </CodeSyntaxHighlighter>

        <div style={{ marginTop: '1rem' }}>
          <DemoButton onClick={fetchUsers} disabled={loading.users}>
            {loading.users ? 'Fetching Users...' : 'Fetch Users'}
          </DemoButton>

          {errors.users && (
            <StatusIndicator status='rejected'>
              Error: {errors.users}
            </StatusIndicator>
          )}

          {users.length > 0 && (
            <DemoOutput>{JSON.stringify(users, null, 2)}</DemoOutput>
          )}
        </div>
      </DemoSection>

      <DemoSection>
        <h4>News Feed with Pagination</h4>
        <p>
          Real-world applications often need to handle paginated data
          efficiently:
        </p>

        <div style={{ marginTop: '1rem' }}>
          <DemoButton onClick={fetchNews} disabled={loading.news}>
            {loading.news ? 'Loading News...' : 'Load News Feed'}
          </DemoButton>

          {errors.news && (
            <StatusIndicator status='rejected'>
              Error: {errors.news}
            </StatusIndicator>
          )}

          {news.length > 0 && (
            <DemoOutput>{JSON.stringify(news, null, 2)}</DemoOutput>
          )}
        </div>
      </DemoSection>

      <DemoSection>
        <h4>WebSocket Real-time Connection</h4>
        <p>
          For real-time features, WebSocket connections provide live updates:
        </p>

        <CodeSyntaxHighlighter language='typescript'>
          {`// WebSocket Hook Pattern
function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  
  const connect = useCallback(() => {
    if (socket?.readyState === WebSocket.OPEN) return
    
    setConnectionState('connecting')
    const ws = new WebSocket(url)
    
    ws.onopen = () => {
      setConnectionState('connected')
      setSocket(ws)
    }
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages(prev => [...prev, data].slice(-50)) // Keep last 50
    }
    
    ws.onclose = () => {
      setConnectionState('disconnected')
      setSocket(null)
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnectionState('disconnected')
    }
  }, [url, socket])
  
  const disconnect = useCallback(() => {
    socket?.close()
  }, [socket])
  
  useEffect(() => {
    return () => {
      socket?.close()
    }
  }, [socket])
  
  return { messages, connectionState, connect, disconnect }
}`}
        </CodeSyntaxHighlighter>

        <div style={{ marginTop: '1rem' }}>
          <DemoButton onClick={connectWebSocket}>
            {wsConnection ? 'Disconnect WebSocket' : 'Connect WebSocket'}
          </DemoButton>

          {wsConnection && (
            <StatusIndicator status='fulfilled'>
              WebSocket Connected - Receiving live updates
            </StatusIndicator>
          )}

          {wsMessages.length > 0 && (
            <div>
              <h5>Recent Messages:</h5>
              <DemoOutput>
                {wsMessages
                  .map(
                    (msg, index) =>
                      `${index + 1}. ${JSON.stringify(msg, null, 2)}\n`
                  )
                  .join('')}
              </DemoOutput>
            </div>
          )}
        </div>
      </DemoSection>

      <DemoSection>
        <h4>GraphQL Integration Pattern</h4>
        <p>GraphQL provides a more flexible approach to API consumption:</p>

        <CodeSyntaxHighlighter language='typescript'>
          {`// GraphQL Client Pattern
class GraphQLClient {
  constructor(private endpoint: string) {}
  
  async query<T>(
    query: string, 
    variables: Record<string, any> = {}
  ): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
    
    const result = await response.json()
    
    if (result.errors) {
      throw new Error(result.errors[0].message)
    }
    
    return result.data
  }
}

// Usage in React Hook
function useGraphQLQuery<T>(query: string, variables: Record<string, any> = {}) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const client = useMemo(() => new GraphQLClient('/graphql'), [])
  
  const executeQuery = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await client.query<T>(query, variables)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('GraphQL query failed'))
    } finally {
      setLoading(false)
    }
  }, [client, query, variables])
  
  return { data, loading, error, executeQuery }
}`}
        </CodeSyntaxHighlighter>
      </DemoSection>
    </DemoContainer>
  )
}

export default ApiIntegrationDemo
