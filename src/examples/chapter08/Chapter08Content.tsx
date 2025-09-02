import { useState } from 'react'

import { CodeSyntaxHighlighter } from '@/examples/shared'
import {
  DemoContainer,
  DemoSection,
  ExampleTitle,
} from '@/examples/shared/TutorialComponents.styles'

import { ApiIntegrationDemo } from './ApiIntegrationDemo'
import { FileOperationsDemo } from './FileOperationsDemo'
import { WebWorkersDemo } from './WebWorkersDemo'

const ChapterContainer = DemoContainer
const ChapterTitle = ExampleTitle
const Section = DemoSection
const SubSection = DemoSection
const Text = ({ children }: { children: React.ReactNode }) => <p>{children}</p>

function Chapter08Content() {
  const [activeSection, setActiveSection] = useState<
    'api' | 'files' | 'workers'
  >('api')

  return (
    <ChapterContainer>
      <ChapterTitle>Chapter 8: Real-World React Applications</ChapterTitle>

      <Text>
        In this advanced chapter, we'll explore how to build production-ready
        React applications that handle complex asynchronous operations. We'll
        cover API integration patterns, file operations, and background
        processing using modern React patterns.
      </Text>

      <Section>
        <h2>What You'll Learn</h2>
        <ul>
          <li>RESTful and GraphQL API integration patterns</li>
          <li>File upload and media processing with progress tracking</li>
          <li>Background tasks using Web Workers</li>
          <li>Building offline-first applications</li>
          <li>Advanced async patterns for real-world applications</li>
        </ul>
      </Section>

      <Section>
        <h2>Chapter Sections</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveSection('api')}
            style={{
              padding: '0.5rem 1rem',
              background: activeSection === 'api' ? '#3b82f6' : '#f3f4f6',
              color: activeSection === 'api' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            API Integration
          </button>
          <button
            onClick={() => setActiveSection('files')}
            style={{
              padding: '0.5rem 1rem',
              background: activeSection === 'files' ? '#3b82f6' : '#f3f4f6',
              color: activeSection === 'files' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            File Operations
          </button>
          <button
            onClick={() => setActiveSection('workers')}
            style={{
              padding: '0.5rem 1rem',
              background: activeSection === 'workers' ? '#3b82f6' : '#f3f4f6',
              color: activeSection === 'workers' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Web Workers
          </button>
        </div>

        {activeSection === 'api' && (
          <SubSection>
            <h3>8.1 API Integration Patterns</h3>
            <Text>
              Modern applications need to communicate with various APIs
              efficiently. We'll explore RESTful API patterns, GraphQL
              integration, and WebSocket connections for real-time data.
            </Text>
            <ApiIntegrationDemo />
          </SubSection>
        )}

        {activeSection === 'files' && (
          <SubSection>
            <h3>8.2 File Operations and Media</h3>
            <Text>
              Learn to handle file uploads, process images, and work with
              streaming data in React applications with proper progress tracking
              and error handling.
            </Text>
            <FileOperationsDemo />
          </SubSection>
        )}

        {activeSection === 'workers' && (
          <SubSection>
            <h3>8.3 Background Tasks and Web Workers</h3>
            <Text>
              Discover how to offload intensive computations to Web Workers and
              implement background synchronization for better user experience.
            </Text>
            <WebWorkersDemo />
          </SubSection>
        )}
      </Section>

      <Section>
        <h2>Key Concepts</h2>

        <SubSection>
          <h3>Production-Ready Patterns</h3>
          <Text>
            Real-world applications require robust error handling, retry
            mechanisms, and graceful degradation. Here's an example of a
            production-ready API client:
          </Text>

          <CodeSyntaxHighlighter language='typescript' showLanguageLabel>
            {`// Production API Client with comprehensive error handling
class ApiClient {
  private baseUrl: string
  private retryAttempts: number
  private timeout: number

  constructor(baseUrl: string, options = {}) {
    this.baseUrl = baseUrl
    this.retryAttempts = options.retries || 3
    this.timeout = options.timeout || 10000
  }

  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    let lastError: Error

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

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
          throw new ApiError(
            \`HTTP \${response.status}: \${response.statusText}\`,
            response.status,
            endpoint
          )
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
}

// Custom error class for API operations
class ApiError extends Error {
  constructor(
    message: string, 
    public status: number, 
    public endpoint: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// React Hook for API operations
function useApiClient() {
  const client = useMemo(() => new ApiClient('/api'), [])
  
  const request = useCallback(async <T>(
    endpoint: string, 
    options?: RequestInit
  ): Promise<T> => {
    return client.request<T>(endpoint, options)
  }, [client])

  return { request }
}`}
          </CodeSyntaxHighlighter>
        </SubSection>

        <SubSection>
          <h3>Error Recovery Strategies</h3>
          <Text>
            Production applications need sophisticated error recovery
            mechanisms:
          </Text>

          <CodeSyntaxHighlighter language='typescript'>
            {`// Comprehensive error recovery hook
function useErrorRecovery<T>() {
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRecovering, setIsRecovering] = useState(false)

  const recover = useCallback(async (
    operation: () => Promise<T>,
    maxRetries = 3
  ): Promise<T | null> => {
    setIsRecovering(true)
    
    try {
      const result = await operation()
      setError(null)
      setRetryCount(0)
      return result
    } catch (err) {
      const newError = err instanceof Error ? err : new Error('Unknown error')
      setError(newError)
      
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1)
        // Schedule automatic retry
        setTimeout(() => recover(operation, maxRetries), 2000)
        return null
      }
      
      throw newError
    } finally {
      setIsRecovering(false)
    }
  }, [retryCount])

  const resetError = useCallback(() => {
    setError(null)
    setRetryCount(0)
  }, [])

  return { error, retryCount, isRecovering, recover, resetError }
}`}
          </CodeSyntaxHighlighter>
        </SubSection>
      </Section>

      <Section>
        <h2>Best Practices Summary</h2>
        <ul>
          <li>Always implement proper error boundaries and retry mechanisms</li>
          <li>Use TypeScript for type-safe API interactions</li>
          <li>Implement loading states and progress indicators</li>
          <li>Handle offline scenarios gracefully</li>
          <li>Use Web Workers for CPU-intensive operations</li>
          <li>Implement proper cancellation for async operations</li>
          <li>Add comprehensive logging and monitoring</li>
        </ul>
      </Section>
    </ChapterContainer>
  )
}

export default Chapter08Content
