import { useCallback, useEffect, useState } from 'react'

import {
  CodeSyntaxHighlighter,
  ImportantNote,
  SuccessNote,
  WarningNote,
} from '@/examples/shared'
import {
  simulateApiCall,
  simulateUnreliableApiCall,
} from '@/utils/async-helpers'

interface ErrorInfo {
  type: 'network' | 'validation' | 'server' | 'unknown'
  message: string
  userMessage: string
  timestamp: Date
  retryable: boolean
}

interface UserProfile {
  id: string
  name: string
  email: string
}

interface DashboardState {
  profile: UserProfile | null
  notifications: string[]
  analytics: { views: number; clicks: number } | null
  loading: {
    profile: boolean
    notifications: boolean
    analytics: boolean
  }
  errors: {
    profile: ErrorInfo | null
    notifications: ErrorInfo | null
    analytics: ErrorInfo | null
  }
}

/**
 * Simulated error categorization utility
 */
function categorizeError(error: unknown): ErrorInfo {
  const timestamp = new Date()

  // Simulate different error types based on error message
  if (error instanceof Error) {
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return {
        type: 'network',
        message: error.message,
        userMessage:
          'Unable to connect. Please check your internet connection and try again.',
        timestamp,
        retryable: true,
      }
    }

    if (
      error.message.includes('validation') ||
      error.message.includes('invalid')
    ) {
      return {
        type: 'validation',
        message: error.message,
        userMessage: 'Please check your information and try again.',
        timestamp,
        retryable: false,
      }
    }

    if (error.message.includes('server') || error.message.includes('500')) {
      return {
        type: 'server',
        message: error.message,
        userMessage:
          'Server error. Our team has been notified. Please try again later.',
        timestamp,
        retryable: true,
      }
    }
  }

  return {
    type: 'unknown',
    message: error instanceof Error ? error.message : 'Unknown error',
    userMessage:
      'Something went wrong. Please try again or contact support if the problem persists.',
    timestamp,
    retryable: false,
  }
}

/**
 * Production-ready Error Handling Demo
 * Demonstrates comprehensive error handling in a dashboard-like application
 */
function ProductionErrorHandlingDemo() {
  const [state, setState] = useState<DashboardState>({
    profile: null,
    notifications: [],
    analytics: null,
    loading: {
      profile: false,
      notifications: false,
      analytics: false,
    },
    errors: {
      profile: null,
      notifications: null,
      analytics: null,
    },
  })

  // Simulated API calls with different reliability
  const fetchProfile = useCallback(async (): Promise<UserProfile> => {
    await simulateApiCall(800)
    return {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    }
  }, [])

  const fetchNotifications = useCallback(async (): Promise<string[]> => {
    // This one sometimes fails to simulate network issues
    await simulateUnreliableApiCall(0.7)
    return [
      'Welcome to the dashboard!',
      'You have 3 unread messages',
      'System maintenance scheduled',
    ]
  }, [])

  const fetchAnalytics = useCallback(async (): Promise<{
    views: number
    clicks: number
  }> => {
    // This one fails more often to simulate server issues
    await simulateUnreliableApiCall(0.5)
    return {
      views: Math.floor(Math.random() * 10000) + 1000,
      clicks: Math.floor(Math.random() * 500) + 100,
    }
  }, [])

  // Generic async operation handler with comprehensive error handling
  const handleAsyncOperation = useCallback(
    async (
      operation: () => Promise<unknown>,
      operationType: keyof DashboardState['loading'],
      successCallback: (data: unknown) => void
    ) => {
      // Set loading state
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, [operationType]: true },
        errors: { ...prev.errors, [operationType]: null },
      }))

      try {
        const result = await operation()
        successCallback(result)

        // Clear any previous errors on success
        setState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [operationType]: null },
        }))
      } catch (error) {
        const errorInfo = categorizeError(error)

        // Log error for monitoring (in production, send to monitoring service)
        // console.error(`${operationType} operation failed:`, errorInfo)

        setState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [operationType]: errorInfo },
        }))
      } finally {
        setState((prev) => ({
          ...prev,
          loading: { ...prev.loading, [operationType]: false },
        }))
      }
    },
    []
  )

  // Load profile data
  const loadProfile = useCallback(() => {
    handleAsyncOperation(fetchProfile, 'profile', (profile) =>
      setState((prev) => ({ ...prev, profile: profile as UserProfile }))
    )
  }, [fetchProfile, handleAsyncOperation])

  // Load notifications data
  const loadNotifications = useCallback(() => {
    handleAsyncOperation(fetchNotifications, 'notifications', (notifications) =>
      setState((prev) => ({
        ...prev,
        notifications: notifications as string[],
      }))
    )
  }, [fetchNotifications, handleAsyncOperation])

  // Load analytics data
  const loadAnalytics = useCallback(() => {
    handleAsyncOperation(fetchAnalytics, 'analytics', (analytics) =>
      setState((prev) => ({
        ...prev,
        analytics: analytics as { views: number; clicks: number },
      }))
    )
  }, [fetchAnalytics, handleAsyncOperation])

  // Load all data on component mount
  useEffect(() => {
    loadProfile()
    loadNotifications()
    loadAnalytics()
  }, [loadProfile, loadNotifications, loadAnalytics])

  // Error recovery function
  const retryFailedOperations = useCallback(() => {
    if (state.errors.profile) loadProfile()
    if (state.errors.notifications) loadNotifications()
    if (state.errors.analytics) loadAnalytics()
  }, [state.errors, loadProfile, loadNotifications, loadAnalytics])

  return (
    <div style={{ margin: '2rem 0' }}>
      <h4>Production Error Handling Dashboard</h4>

      <WarningNote>
        <strong>Demo Configuration:</strong> This demo simulates various failure
        scenarios to demonstrate error handling patterns. Profile loads
        reliably, notifications fail 30% of the time, and analytics fail 50% of
        the time.
      </WarningNote>

      {/* Dashboard Controls */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={retryFailedOperations}
          style={{
            padding: '0.5rem 1rem',
            margin: '0.5rem 0.5rem 0.5rem 0',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🔄 Retry Failed Operations
        </button>

        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset Demo
        </button>
      </div>

      {/* Dashboard Widgets */}
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          marginBottom: '2rem',
        }}
      >
        {/* Profile Widget */}
        <div
          style={{
            padding: '1rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            backgroundColor: state.errors.profile ? '#fef2f2' : '#f8fafc',
          }}
        >
          <h5>👤 User Profile</h5>

          {state.loading.profile && (
            <div style={{ color: '#2563eb' }}>Loading profile...</div>
          )}

          {state.errors.profile && (
            <div>
              <div style={{ color: '#dc2626', marginBottom: '0.5rem' }}>
                ❌ {state.errors.profile.userMessage}
              </div>
              {state.errors.profile.retryable && (
                <button
                  onClick={loadProfile}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {state.profile && !state.loading.profile && !state.errors.profile && (
            <div>
              <div>
                <strong>{state.profile.name}</strong>
              </div>
              <div style={{ color: '#6b7280' }}>{state.profile.email}</div>
              <div
                style={{
                  color: '#16a34a',
                  fontSize: '0.75rem',
                  marginTop: '0.5rem',
                }}
              >
                ✅ Loaded successfully
              </div>
            </div>
          )}
        </div>

        {/* Notifications Widget */}
        <div
          style={{
            padding: '1rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            backgroundColor: state.errors.notifications ? '#fef2f2' : '#f8fafc',
          }}
        >
          <h5>🔔 Notifications</h5>

          {state.loading.notifications && (
            <div style={{ color: '#2563eb' }}>Loading notifications...</div>
          )}

          {state.errors.notifications && (
            <div>
              <div style={{ color: '#dc2626', marginBottom: '0.5rem' }}>
                ❌ {state.errors.notifications.userMessage}
              </div>
              {state.errors.notifications.retryable && (
                <button
                  onClick={loadNotifications}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {state.notifications.length > 0 &&
            !state.loading.notifications &&
            !state.errors.notifications && (
              <div>
                {state.notifications.slice(0, 3).map((notification, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '0.25rem 0',
                      borderBottom: index < 2 ? '1px solid #e5e7eb' : 'none',
                      fontSize: '0.875rem',
                    }}
                  >
                    {notification}
                  </div>
                ))}
                <div
                  style={{
                    color: '#16a34a',
                    fontSize: '0.75rem',
                    marginTop: '0.5rem',
                  }}
                >
                  ✅ {state.notifications.length} notifications loaded
                </div>
              </div>
            )}
        </div>

        {/* Analytics Widget */}
        <div
          style={{
            padding: '1rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            backgroundColor: state.errors.analytics ? '#fef2f2' : '#f8fafc',
          }}
        >
          <h5>📊 Analytics</h5>

          {state.loading.analytics && (
            <div style={{ color: '#2563eb' }}>Loading analytics...</div>
          )}

          {state.errors.analytics && (
            <div>
              <div style={{ color: '#dc2626', marginBottom: '0.5rem' }}>
                ❌ {state.errors.analytics.userMessage}
              </div>
              {state.errors.analytics.retryable && (
                <button
                  onClick={loadAnalytics}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Retry
                </button>
              )}
              <div
                style={{
                  color: '#6b7280',
                  fontSize: '0.75rem',
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '4px',
                }}
              >
                📈 Showing cached data from last successful load
              </div>
            </div>
          )}

          {state.analytics &&
            !state.loading.analytics &&
            !state.errors.analytics && (
              <div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                      }}
                    >
                      {state.analytics.views.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Views
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#10b981',
                      }}
                    >
                      {state.analytics.clicks.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Clicks
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    color: '#16a34a',
                    fontSize: '0.75rem',
                    marginTop: '0.5rem',
                  }}
                >
                  ✅ Real-time data
                </div>
              </div>
            )}
        </div>
      </div>

      <h5>Error Handling Implementation</h5>

      <CodeSyntaxHighlighter language='typescript' showLineNumbers>
        {`// Production error handling pattern
interface ErrorInfo {
  type: 'network' | 'validation' | 'server' | 'unknown'
  message: string
  userMessage: string
  timestamp: Date
  retryable: boolean
}

const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  operationType: string,
  successCallback: (data: T) => void
) => {
  setLoading(prev => ({ ...prev, [operationType]: true }))
  
  try {
    const result = await operation()
    successCallback(result)
    clearErrors(operationType)
  } catch (error) {
    const errorInfo = categorizeError(error)
    
    // Log for monitoring
    logError(operationType, errorInfo)
    
    // Update UI state
    setErrors(prev => ({ ...prev, [operationType]: errorInfo }))
    
    // Show user-friendly notification
    showErrorToast(errorInfo.userMessage)
  } finally {
    setLoading(prev => ({ ...prev, [operationType]: false }))
  }
}`}
      </CodeSyntaxHighlighter>

      <ImportantNote>
        <strong>Key Production Patterns:</strong>
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li>
            <strong>Error Categorization:</strong> Different error types get
            different handling
          </li>
          <li>
            <strong>Graceful Degradation:</strong> Show cached data or fallback
            content when possible
          </li>
          <li>
            <strong>Selective Retry:</strong> Only retry operations that can
            reasonably succeed
          </li>
          <li>
            <strong>User-Friendly Messages:</strong> Technical errors become
            actionable user guidance
          </li>
          <li>
            <strong>Recovery Actions:</strong> Provide clear paths for users to
            resolve issues
          </li>
        </ul>
      </ImportantNote>

      <SuccessNote>
        <strong>Monitoring Integration:</strong> In production, all errors
        should be logged to monitoring services (Sentry, LogRocket, etc.) with
        context about user actions, component state, and system conditions to
        help with debugging.
      </SuccessNote>
    </div>
  )
}

export default ProductionErrorHandlingDemo
