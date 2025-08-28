import { useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoOutput,
  DemoSection,
  ExampleTitle,
  ImportantNote,
  StatusIndicator,
} from '@/examples/shared'
import { simulateApiCall } from '@/utils/async-helpers'

interface DashboardData {
  user: { name: string; email: string }
  posts: { title: string; views: number }[]
  analytics: { pageViews: number; uniqueUsers: number }
}

/**
 * Demonstrates Promise.all() for parallel execution with React integration
 * Shows dashboard loading scenario with multiple concurrent API calls
 */
function PromiseAllDemo() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string>('')
  const [executionTime, setExecutionTime] = useState<number>(0)

  // Simulate individual API calls with different response times
  const fetchUserData = async (): Promise<DashboardData['user']> => {
    await simulateApiCall(800) // 800ms delay
    return {
      name: 'John Doe',
      email: 'john@example.com',
    }
  }

  const fetchUserPosts = async (): Promise<DashboardData['posts']> => {
    await simulateApiCall(1200) // 1200ms delay
    return [
      { title: 'Getting Started with React', views: 1250 },
      { title: 'Advanced Promise Patterns', views: 890 },
      { title: 'Building Modern UIs', views: 2100 },
    ]
  }

  const fetchAnalytics = async (): Promise<DashboardData['analytics']> => {
    await simulateApiCall(600) // 600ms delay
    return {
      pageViews: 45230,
      uniqueUsers: 12400,
    }
  }

  // Simulate a failing API call for error demonstration
  const fetchUserDataWithError = async (): Promise<DashboardData['user']> => {
    await simulateApiCall(400)
    throw new Error('User service is temporarily unavailable')
  }

  const loadDashboardDataSuccess = async () => {
    setStatus('loading')
    setError('')
    setDashboardData(null)
    const startTime = Date.now()

    try {
      // Promise.all executes all promises in parallel
      // Total time will be the longest individual request (1200ms), not the sum
      const [userData, postsData, analyticsData] = await Promise.all([
        fetchUserData(),
        fetchUserPosts(),
        fetchAnalytics(),
      ])

      const endTime = Date.now()
      setExecutionTime(endTime - startTime)

      setDashboardData({
        user: userData,
        posts: postsData,
        analytics: analyticsData,
      })
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
      const endTime = Date.now()
      setExecutionTime(endTime - startTime)
    }
  }

  const loadDashboardDataWithError = async () => {
    setStatus('loading')
    setError('')
    setDashboardData(null)
    const startTime = Date.now()

    try {
      // This will fail because one of the promises rejects
      const [userData, postsData, analyticsData] = await Promise.all([
        fetchUserDataWithError(), // This will throw an error
        fetchUserPosts(),
        fetchAnalytics(),
      ])

      const endTime = Date.now()
      setExecutionTime(endTime - startTime)

      setDashboardData({
        user: userData,
        posts: postsData,
        analytics: analyticsData,
      })
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
      const endTime = Date.now()
      setExecutionTime(endTime - startTime)
    }
  }

  return (
    <DemoSection>
      <ExampleTitle>Promise.all() - Parallel Execution</ExampleTitle>

      <p>
        <code>Promise.all()</code> executes multiple promises in parallel and
        waits for all of them to resolve. It's perfect for loading dashboard
        data where you need multiple pieces of information simultaneously.
      </p>

      <ImportantNote>
        <strong>Key Characteristics:</strong>
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li>
            <strong>Parallel Execution:</strong> All promises start immediately
          </li>
          <li>
            <strong>All-or-Nothing:</strong> If any promise rejects, the entire
            operation fails
          </li>
          <li>
            <strong>Order Preserved:</strong> Results array matches input array
            order
          </li>
          <li>
            <strong>Performance:</strong> Total time = longest individual
            request (not sum)
          </li>
        </ul>
      </ImportantNote>

      <DemoContainer>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <DemoButton
            onClick={loadDashboardDataSuccess}
            disabled={status === 'loading'}
          >
            Load Dashboard (Success)
          </DemoButton>
          <DemoButton
            onClick={loadDashboardDataWithError}
            disabled={status === 'loading'}
          >
            Load Dashboard (With Error)
          </DemoButton>
        </div>

        <StatusIndicator status={status}>
          <strong>Status:</strong> {status}
          {executionTime > 0 && (
            <span>
              {' '}
              | <strong>Execution Time:</strong> {executionTime}ms
            </span>
          )}
        </StatusIndicator>

        {dashboardData && (
          <DemoOutput>{JSON.stringify(dashboardData, null, 2)}</DemoOutput>
        )}

        {error && (
          <DemoOutput style={{ background: '#fee2e2', color: '#991b1b' }}>
            Error: {error}
          </DemoOutput>
        )}
      </DemoContainer>

      <h4>React Implementation</h4>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Dashboard component using Promise.all for parallel loading
function Dashboard() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  const loadDashboardData = async () => {
    setStatus('loading')
    
    try {
      // All API calls execute in parallel - total time is the slowest request
      const [userData, postsData, analyticsData] = await Promise.all([
        fetchUserData(),      // 800ms
        fetchUserPosts(),     // 1200ms (slowest)
        fetchAnalytics(),     // 600ms
      ])
      // Total time: ~1200ms (not 2600ms)
      
      setDashboardData({ user: userData, posts: postsData, analytics: analyticsData })
      setStatus('success')
    } catch (error) {
      // If ANY promise rejects, this catch block runs
      setStatus('error')
      console.error('Dashboard load failed:', error)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (status === 'loading') return <LoadingSpinner />
  if (status === 'error') return <ErrorMessage />
  
  return (
    <div>
      <UserProfile user={dashboardData?.user} />
      <PostsList posts={dashboardData?.posts} />
      <AnalyticsDashboard analytics={dashboardData?.analytics} />
    </div>
  )
}`}
      </CodeSyntaxHighlighter>

      <h4>When to Use Promise.all()</h4>

      <ul>
        <li>
          <strong>Dashboard Loading:</strong> Load multiple independent data
          sources
        </li>
        <li>
          <strong>Batch Operations:</strong> Process multiple items
          simultaneously
        </li>
        <li>
          <strong>Resource Fetching:</strong> Load CSS, images, and data in
          parallel
        </li>
        <li>
          <strong>Form Validation:</strong> Run multiple async validations
          simultaneously
        </li>
      </ul>

      <ImportantNote>
        <strong>Caution:</strong> Promise.all() fails fast. If any promise
        rejects, the entire operation fails immediately, even if other promises
        would have succeeded. Use Promise.allSettled() if you need partial
        results.
      </ImportantNote>
    </DemoSection>
  )
}

export default PromiseAllDemo
