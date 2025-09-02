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
  SuccessNote,
} from '@/examples/shared'
import { simulateApiCall } from '@/utils/async-helpers'

interface HealthCheckResult {
  service: string
  status: 'fulfilled' | 'rejected'
  value?: { service: string; healthy: boolean }
  reason?: string
  responseTime: number
}

/**
 * Demonstrates Promise.allSettled() for handling partial failures gracefully
 * Shows health check scenario where some services might be down
 */
function PromiseAllSettledDemo() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'complete'>('idle')
  const [healthResults, setHealthResults] = useState<HealthCheckResult[]>([])
  const [totalTime, setTotalTime] = useState<number>(0)

  // Simulate different service health checks with varying success rates
  const checkUserService = async (): Promise<{
    service: string
    healthy: boolean
  }> => {
    await simulateApiCall(600)

    // 90% success rate
    if (Math.random() > 0.1) {
      return { service: 'User Service', healthy: true }
    } else {
      throw new Error('User Service: Database connection timeout')
    }
  }

  const checkPaymentService = async (): Promise<{
    service: string
    healthy: boolean
  }> => {
    await simulateApiCall(800)

    // 70% success rate (less reliable)
    if (Math.random() > 0.3) {
      return { service: 'Payment Service', healthy: true }
    } else {
      throw new Error('Payment Service: External API rate limit exceeded')
    }
  }

  const checkNotificationService = async (): Promise<{
    service: string
    healthy: boolean
  }> => {
    await simulateApiCall(400)

    // 95% success rate (very reliable)
    if (Math.random() > 0.05) {
      return { service: 'Notification Service', healthy: true }
    } else {
      throw new Error('Notification Service: SMTP server unavailable')
    }
  }

  const checkAnalyticsService = async (): Promise<{
    service: string
    healthy: boolean
  }> => {
    await simulateApiCall(1000)

    // 60% success rate (unreliable)
    if (Math.random() > 0.4) {
      return { service: 'Analytics Service', healthy: true }
    } else {
      throw new Error(
        'Analytics Service: Data warehouse maintenance in progress'
      )
    }
  }

  const runHealthChecks = async () => {
    setStatus('loading')
    setHealthResults([])
    const startTime = Date.now()

    // Promise.allSettled never rejects - it waits for all promises to settle
    const results = await Promise.allSettled([
      checkUserService(),
      checkPaymentService(),
      checkNotificationService(),
      checkAnalyticsService(),
    ])

    const endTime = Date.now()
    setTotalTime(endTime - startTime)

    // Transform results into our display format
    const healthData: HealthCheckResult[] = results.map((result, index) => {
      const services = [
        'User Service',
        'Payment Service',
        'Notification Service',
        'Analytics Service',
      ]

      return {
        service: services[index],
        status: result.status,
        value: result.status === 'fulfilled' ? result.value : undefined,
        reason:
          result.status === 'rejected' ? result.reason.message : undefined,
        responseTime: [600, 800, 400, 1000][index], // Simulated response times
      }
    })

    setHealthResults(healthData)
    setStatus('complete')
  }

  const getHealthSummary = () => {
    if (healthResults.length === 0) return null

    const healthy = healthResults.filter((r) => r.status === 'fulfilled').length
    const total = healthResults.length
    const percentage = Math.round((healthy / total) * 100)

    return {
      healthy,
      total,
      percentage,
      critical: healthResults.filter(
        (r) =>
          r.status === 'rejected' &&
          (r.service.includes('User') || r.service.includes('Payment'))
      ).length,
    }
  }

  const summary = getHealthSummary()

  return (
    <DemoSection>
      <ExampleTitle>
        Promise.allSettled() - Graceful Partial Failures
      </ExampleTitle>

      <p>
        <code>Promise.allSettled()</code> waits for all promises to settle
        (resolve or reject) and returns all results. Unlike Promise.all(), it
        never rejects and always provides complete information about successes
        and failures.
      </p>

      <ImportantNote>
        <strong>Key Characteristics:</strong>
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li key='never-rejects'>
            <strong>Never Rejects:</strong> Always resolves with all results
          </li>
          <li key='complete-information'>
            <strong>Complete Information:</strong> Get both successes and
            failures
          </li>
          <li key='graceful-degradation'>
            <strong>Graceful Degradation:</strong> Continue with partial data
          </li>
          <li key='perfect-for-health-checks'>
            <strong>Perfect for Health Checks:</strong> Monitor multiple
            services
          </li>
        </ul>
      </ImportantNote>

      <DemoContainer>
        <DemoButton onClick={runHealthChecks} disabled={status === 'loading'}>
          Run System Health Check
        </DemoButton>

        <StatusIndicator
          status={status === 'loading' ? 'pending' : 'fulfilled'}
        >
          <strong>Status:</strong>{' '}
          {status === 'loading'
            ? 'Checking services...'
            : `Complete in ${totalTime}ms`}
        </StatusIndicator>

        {summary && (
          <div
            style={{
              background:
                summary.percentage >= 75
                  ? '#dcfce7'
                  : summary.percentage >= 50
                    ? '#fef3c7'
                    : '#fee2e2',
              padding: '1rem',
              borderRadius: '8px',
              margin: '1rem 0',
              border: `1px solid ${summary.percentage >= 75 ? '#10b981' : summary.percentage >= 50 ? '#f59e0b' : '#ef4444'}`,
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem 0' }}>System Health Summary</h4>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>
                {summary.healthy}/{summary.total}
              </strong>{' '}
              services healthy ({summary.percentage}%)
            </p>
            {summary.critical > 0 && (
              <p
                style={{
                  margin: '0.25rem 0',
                  color: '#991b1b',
                  fontWeight: '600',
                }}
              >
                ⚠️ {summary.critical} critical service(s) down
              </p>
            )}
          </div>
        )}

        {healthResults.length > 0 && (
          <DemoOutput>
            {healthResults
              .map(
                (result, index) =>
                  `${result.service}:
  Status: ${result.status}
  ${
    result.status === 'fulfilled'
      ? `✅ Healthy - Response: ${result.responseTime}ms`
      : `❌ Failed - ${result.reason}`
  }
${index < healthResults.length - 1 ? '\n' : ''}`
              )
              .join('')}
          </DemoOutput>
        )}
      </DemoContainer>

      <h4>React Implementation</h4>

      <CodeSyntaxHighlighter language='typescript'>
        {`// System health dashboard using Promise.allSettled
function HealthDashboard() {
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult[]>([])
  const [loading, setLoading] = useState(false)

  const runHealthChecks = async () => {
    setLoading(true)
    
    // Promise.allSettled waits for ALL promises to complete
    const results = await Promise.allSettled([
      checkUserService(),
      checkPaymentService(), 
      checkNotificationService(),
      checkAnalyticsService(),
    ])
    
    // Transform results - both successes and failures
    const healthData = results.map((result, index) => ({
      service: serviceNames[index],
      status: result.status,
      value: result.status === 'fulfilled' ? result.value : undefined,
      error: result.status === 'rejected' ? result.reason.message : undefined,
    }))
    
    setHealthStatus(healthData)
    setLoading(false)
  }

  // Calculate overall system health
  const systemHealth = healthStatus.reduce((acc, service) => {
    if (service.status === 'fulfilled') acc.healthy++
    else acc.failed++
    return acc
  }, { healthy: 0, failed: 0 })

  return (
    <div>
      <button onClick={runHealthChecks} disabled={loading}>
        {loading ? 'Checking...' : 'Run Health Check'}
      </button>
      
      <HealthSummary 
        healthy={systemHealth.healthy} 
        total={healthStatus.length} 
      />
      
      {healthStatus.map(service => (
        <ServiceStatus 
          key={service.service}
          name={service.service}
          status={service.status}
          error={service.error}
        />
      ))}
    </div>
  )
}`}
      </CodeSyntaxHighlighter>

      <h4>When to Use Promise.allSettled()</h4>

      <ul>
        <li key='system-health-checks'>
          <strong>System Health Checks:</strong> Monitor multiple services
          independently
        </li>
        <li key='batch-processing'>
          <strong>Batch Processing:</strong> Process items where some might fail
        </li>
        <li key='feature-flags'>
          <strong>Feature Flags:</strong> Load multiple configuration sources
        </li>
        <li key='analytics-collection'>
          <strong>Analytics Collection:</strong> Send data to multiple endpoints
        </li>
        <li key='social-media-posting'>
          <strong>Social Media Posting:</strong> Post to multiple platforms
        </li>
      </ul>

      <SuccessNote>
        <strong>Best Practice:</strong> Use Promise.allSettled() when you need
        to continue operation even if some promises fail. It provides complete
        visibility into both successes and failures, enabling graceful
        degradation strategies.
      </SuccessNote>
    </DemoSection>
  )
}

export default PromiseAllSettledDemo
