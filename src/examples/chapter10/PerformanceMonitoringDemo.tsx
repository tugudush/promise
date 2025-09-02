import { useCallback, useEffect, useRef, useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoSection,
  ExampleTitle,
  StatusIndicator,
} from '@/examples/shared'
import { simulateApiCall } from '@/utils/async-helpers'

// Type definitions for performance monitoring
interface PerformanceMemory {
  usedJSHeapSize?: number
  totalJSHeapSize?: number
  jsHeapSizeLimit?: number
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory
}

interface PerformanceMetric {
  duration: number
  memoryDelta?: number
  success: boolean
  error?: string
  timestamp: string
}

interface PerformanceData {
  [operationName: string]: {
    averageDuration: number
    successRate: number
    totalOperations: number
    recentMetrics: Array<{
      duration: number
      success: boolean
      timestamp: string
      error?: string
      memoryDelta?: number
    }>
  } | null
}

interface ProfileDataItem {
  name: string
  duration: number
  success: boolean
  memoryDelta?: number
  error?: string
}

// Performance monitoring classes
class AsyncPerformanceMonitor {
  private metrics = new Map<
    string,
    Array<{
      duration: number
      success: boolean
      timestamp: string
      error?: string
      memoryDelta?: number
    }>
  >()

  // Track async operation performance
  async measureAsync<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now()
    const startMemory =
      (performance as ExtendedPerformance).memory?.usedJSHeapSize || 0

    try {
      const result = await operation()

      const endTime = performance.now()
      const endMemory =
        (performance as ExtendedPerformance).memory?.usedJSHeapSize || 0

      this.recordMetric(operationName, {
        duration: endTime - startTime,
        memoryDelta: endMemory - startMemory,
        success: true,
        timestamp: new Date().toISOString(),
      })

      return result
    } catch (error) {
      const endTime = performance.now()

      this.recordMetric(operationName, {
        duration: endTime - startTime,
        success: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  }

  private recordMetric(name: string, metric: PerformanceMetric) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    const metrics = this.metrics.get(name)!
    metrics.push(metric)

    // Keep only last 50 metrics to prevent memory bloat
    if (metrics.length > 50) {
      metrics.shift()
    }
  }

  getMetrics(operationName?: string) {
    if (operationName) {
      return this.metrics.get(operationName) || []
    }
    return Object.fromEntries(this.metrics)
  }

  getAveragePerformance(operationName: string) {
    const metrics = this.metrics.get(operationName) || []
    if (metrics.length === 0) return null

    const successful = metrics.filter((m) => m.success)
    const avgDuration =
      successful.reduce((sum, m) => sum + m.duration, 0) / successful.length
    const successRate = successful.length / metrics.length

    return {
      averageDuration: Math.round(avgDuration),
      successRate: Math.round(successRate * 100),
      totalOperations: metrics.length,
      recentMetrics: metrics.slice(-10),
    }
  }

  clearMetrics() {
    this.metrics.clear()
  }
}

function PerformanceMonitoringDemo() {
  return (
    <DemoSection>
      <ExampleTitle>Demo: Performance Monitoring</ExampleTitle>
      <p>
        Learn how to monitor and profile async operations to identify
        performance bottlenecks and optimization opportunities.
      </p>

      <AsyncPerformanceDemo />
      <RealTimeMetricsDemo />
      <PerformanceProfilingDemo />
    </DemoSection>
  )
}

// Async performance monitoring demonstration
function AsyncPerformanceDemo() {
  const [performanceData, setPerformanceData] =
    useState<PerformanceData | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const monitor = useRef(new AsyncPerformanceMonitor())

  const runPerformanceTest = useCallback(
    async (testType: 'fast' | 'slow' | 'mixed') => {
      setIsRunning(true)
      setPerformanceData(null)

      try {
        switch (testType) {
          case 'fast':
            // Fast operations
            await Promise.all([
              monitor.current.measureAsync('fast-op-1', () =>
                simulateApiCall(100)
              ),
              monitor.current.measureAsync('fast-op-2', () =>
                simulateApiCall(150)
              ),
              monitor.current.measureAsync('fast-op-3', () =>
                simulateApiCall(80)
              ),
            ])
            break

          case 'slow':
            // Slow operations
            await Promise.all([
              monitor.current.measureAsync('slow-op-1', () =>
                simulateApiCall(2000)
              ),
              monitor.current.measureAsync('slow-op-2', () =>
                simulateApiCall(2500)
              ),
              monitor.current.measureAsync('slow-op-3', () =>
                simulateApiCall(1800)
              ),
            ])
            break

          case 'mixed':
            // Mixed performance operations
            await Promise.all([
              monitor.current.measureAsync('mixed-op-fast', () =>
                simulateApiCall(200)
              ),
              monitor.current.measureAsync('mixed-op-medium', () =>
                simulateApiCall(1000)
              ),
              monitor.current.measureAsync('mixed-op-slow', () =>
                simulateApiCall(2000)
              ),
              monitor.current.measureAsync('mixed-op-error', () =>
                Math.random() > 0.5
                  ? simulateApiCall(500)
                  : Promise.reject(new Error('Simulated error'))
              ),
            ])
            break
        }

        // Get performance stats
        const allMetrics = monitor.current.getMetrics()
        const stats = Object.keys(allMetrics).reduce((acc, key) => {
          acc[key] = monitor.current.getAveragePerformance(key)
          return acc
        }, {} as PerformanceData)

        setPerformanceData(stats)
      } catch {
        // Some operations may fail, that's part of the demo
        const allMetrics = monitor.current.getMetrics()
        const stats = Object.keys(allMetrics).reduce((acc, key) => {
          acc[key] = monitor.current.getAveragePerformance(key)
          return acc
        }, {} as PerformanceData)

        setPerformanceData(stats)
      } finally {
        setIsRunning(false)
      }
    },
    []
  )

  const clearMetrics = useCallback(() => {
    monitor.current.clearMetrics()
    setPerformanceData(null)
  }, [])

  return (
    <DemoContainer>
      <h4>Async Operation Monitoring</h4>
      <p>
        Monitor the performance of different async operations to identify
        patterns and bottlenecks:
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <DemoButton
          onClick={() => runPerformanceTest('fast')}
          disabled={isRunning}
        >
          Test Fast Operations
        </DemoButton>
        <DemoButton
          onClick={() => runPerformanceTest('slow')}
          disabled={isRunning}
        >
          Test Slow Operations
        </DemoButton>
        <DemoButton
          onClick={() => runPerformanceTest('mixed')}
          disabled={isRunning}
        >
          Test Mixed Performance
        </DemoButton>
        <DemoButton onClick={clearMetrics}>Clear Metrics</DemoButton>
      </div>

      <StatusIndicator status={isRunning ? 'loading' : 'idle'}>
        {isRunning
          ? 'Running performance tests...'
          : performanceData
            ? 'Performance data collected'
            : 'Ready to run tests'}
      </StatusIndicator>

      {performanceData && (
        <div
          style={{
            marginTop: '1rem',
            background: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          <h6>Performance Results:</h6>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            {Object.entries(performanceData).map(
              ([operation, stats]: [string, PerformanceData[string]]) =>
                stats && (
                  <div
                    key={operation}
                    style={{
                      background:
                        stats.successRate === 100
                          ? '#dcfce7'
                          : stats.successRate > 0
                            ? '#fef3c7'
                            : '#fee2e2',
                      padding: '1rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                      {operation}
                    </div>
                    <div>Avg Duration: {stats.averageDuration}ms</div>
                    <div>Success Rate: {stats.successRate}%</div>
                    <div>Total Runs: {stats.totalOperations}</div>
                  </div>
                )
            )}
          </div>
        </div>
      )}

      <CodeSyntaxHighlighter language='typescript'>
        {`// Performance monitoring implementation
class AsyncPerformanceMonitor {
  private metrics = new Map()
  
  async measureAsync<T>(name: string, operation: () => Promise<T>) {
    const startTime = performance.now()
    
    try {
      const result = await operation()
      const duration = performance.now() - startTime
      
      this.recordMetric(name, {
        duration,
        success: true,
        timestamp: new Date().toISOString()
      })
      
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      
      this.recordMetric(name, {
        duration,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      })
      
      throw error
    }
  }
  
  getAveragePerformance(operationName: string) {
    const metrics = this.metrics.get(operationName) || []
    const successful = metrics.filter(m => m.success)
    
    return {
      averageDuration: successful.reduce((sum, m) => sum + m.duration, 0) / successful.length,
      successRate: successful.length / metrics.length,
      totalOperations: metrics.length
    }
  }
}

// Usage with React hook
function usePerformanceMonitor() {
  const monitor = useRef(new AsyncPerformanceMonitor())
  
  return {
    measureAsync: monitor.current.measureAsync.bind(monitor.current),
    getMetrics: monitor.current.getMetrics.bind(monitor.current)
  }
}`}
      </CodeSyntaxHighlighter>
    </DemoContainer>
  )
}

// Real-time metrics demonstration
function RealTimeMetricsDemo() {
  const [metrics, setMetrics] = useState<{ [key: string]: number }>({
    requests: 0,
    errors: 0,
    avgResponseTime: 0,
    memoryUsage: 0,
  })
  const [isMonitoring, setIsMonitoring] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)

    intervalRef.current = setInterval(() => {
      // Simulate real-time metrics
      setMetrics((prev) => ({
        requests: prev.requests + Math.floor(Math.random() * 5) + 1,
        errors: prev.errors + (Math.random() > 0.9 ? 1 : 0),
        avgResponseTime: Math.floor(Math.random() * 500) + 100,
        memoryUsage:
          ((performance as ExtendedPerformance).memory?.usedJSHeapSize || 0) /
          1024 /
          1024, // MB
      }))
    }, 1000)
  }, [])

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const resetMetrics = useCallback(() => {
    setMetrics({
      requests: 0,
      errors: 0,
      avgResponseTime: 0,
      memoryUsage: 0,
    })
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const errorRate =
    metrics.requests > 0 ? (metrics.errors / metrics.requests) * 100 : 0

  return (
    <DemoContainer>
      <h4>Real-Time Performance Metrics</h4>
      <p>
        Monitor live application metrics to track performance trends and
        identify issues as they occur:
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <DemoButton onClick={isMonitoring ? stopMonitoring : startMonitoring}>
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </DemoButton>
        <DemoButton onClick={resetMetrics}>Reset Metrics</DemoButton>
      </div>

      <StatusIndicator status={isMonitoring ? 'loading' : 'idle'}>
        {isMonitoring ? 'Monitoring active' : 'Monitoring stopped'}
      </StatusIndicator>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        <div
          style={{
            background: '#dbeafe',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e40af' }}
          >
            {metrics.requests}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>
            Total Requests
          </div>
        </div>

        <div
          style={{
            background: errorRate > 5 ? '#fee2e2' : '#dcfce7',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: errorRate > 5 ? '#dc2626' : '#166534',
            }}
          >
            {errorRate.toFixed(1)}%
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: errorRate > 5 ? '#dc2626' : '#166534',
            }}
          >
            Error Rate
          </div>
        </div>

        <div
          style={{
            background: metrics.avgResponseTime > 300 ? '#fef3c7' : '#dcfce7',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: metrics.avgResponseTime > 300 ? '#d97706' : '#166534',
            }}
          >
            {metrics.avgResponseTime}ms
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: metrics.avgResponseTime > 300 ? '#d97706' : '#166534',
            }}
          >
            Avg Response Time
          </div>
        </div>

        <div
          style={{
            background: '#f3e8ff',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '1.5rem', fontWeight: '600', color: '#7c3aed' }}
          >
            {metrics.memoryUsage.toFixed(1)}MB
          </div>
          <div style={{ fontSize: '0.875rem', color: '#7c3aed' }}>
            Memory Usage
          </div>
        </div>
      </div>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Real-time metrics collection
class MetricsCollector {
  private metrics = {
    requests: 0,
    errors: 0,
    responseTimes: [],
    memorySnapshots: []
  }
  
  recordRequest(duration: number, success: boolean) {
    this.metrics.requests++
    this.metrics.responseTimes.push(duration)
    
    if (!success) {
      this.metrics.errors++
    }
    
    // Keep only last 100 entries to prevent memory bloat
    if (this.metrics.responseTimes.length > 100) {
      this.metrics.responseTimes.shift()
    }
    
    // Send to monitoring service
    this.sendToAnalytics({
      type: 'request',
      duration,
      success,
      timestamp: Date.now()
    })
  }
  
  getSnapshot() {
    const avgResponseTime = this.metrics.responseTimes.length > 0
      ? this.metrics.responseTimes.reduce((a, b) => a + b, 0) / this.metrics.responseTimes.length
      : 0
      
    return {
      totalRequests: this.metrics.requests,
      errorRate: this.metrics.requests > 0 
        ? (this.metrics.errors / this.metrics.requests) * 100 
        : 0,
      avgResponseTime: Math.round(avgResponseTime),
      memoryUsage: performance.memory?.usedJSHeapSize || 0
    }
  }
  
  private sendToAnalytics(data: any) {
    // Send to your analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_metric', data)
    }
  }
}`}
      </CodeSyntaxHighlighter>
    </DemoContainer>
  )
}

// Performance profiling demonstration
function PerformanceProfilingDemo() {
  const [profileData, setProfileData] = useState<ProfileDataItem[]>([])
  const [isProfiling, setIsProfiling] = useState(false)

  const runProfiler = useCallback(async () => {
    setIsProfiling(true)
    setProfileData([])

    // Simulate complex operations for profiling
    const operations = [
      { name: 'Data Processing', fn: () => simulateDataProcessing() },
      { name: 'API Calls', fn: () => simulateApiCalls() },
      { name: 'DOM Updates', fn: () => simulateDomUpdates() },
      { name: 'Memory Operations', fn: () => simulateMemoryOperations() },
    ]

    const results = []

    for (const operation of operations) {
      const startTime = performance.now()
      const startMemory =
        (performance as ExtendedPerformance).memory?.usedJSHeapSize || 0

      try {
        await operation.fn()
        const endTime = performance.now()
        const endMemory =
          (performance as ExtendedPerformance).memory?.usedJSHeapSize || 0

        results.push({
          name: operation.name,
          duration: Math.round(endTime - startTime),
          memoryDelta: endMemory - startMemory,
          success: true,
        })
      } catch (error) {
        const endTime = performance.now()
        results.push({
          name: operation.name,
          duration: Math.round(endTime - startTime),
          error: (error as Error).message,
          success: false,
        })
      }
    }

    setProfileData(results)
    setIsProfiling(false)
  }, [])

  // Simulate different types of operations
  const simulateDataProcessing = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    // Simulate CPU-intensive work
    let result = 0
    for (let i = 0; i < 1000000; i++) {
      result += Math.random()
    }
    return result
  }

  const simulateApiCalls = async () => {
    const calls = Array.from({ length: 5 }, () =>
      simulateApiCall(Math.random() * 500 + 200)
    )
    return Promise.all(calls)
  }

  const simulateDomUpdates = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    // Simulate DOM manipulation
    const elements = Array.from({ length: 100 }, () =>
      document.createElement('div')
    )
    elements.forEach((el) => (el.textContent = 'Test'))
    return elements.length
  }

  const simulateMemoryOperations = async () => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    // Simulate memory-intensive operations
    const largeArray = new Array(100000).fill(0).map(() => ({
      id: Math.random(),
      data: new Array(100).fill('data'),
    }))
    return largeArray.length
  }

  return (
    <DemoContainer>
      <h4>Performance Profiling</h4>
      <p>
        Profile different types of operations to understand their performance
        characteristics and resource usage:
      </p>

      <DemoButton onClick={runProfiler} disabled={isProfiling}>
        {isProfiling ? 'Profiling...' : 'Run Performance Profile'}
      </DemoButton>

      <StatusIndicator status={isProfiling ? 'loading' : 'idle'}>
        {isProfiling
          ? 'Running performance analysis...'
          : profileData
            ? 'Profile complete'
            : 'Ready to profile'}
      </StatusIndicator>

      {profileData && (
        <div style={{ marginTop: '1rem' }}>
          <h6>Profile Results:</h6>
          <div
            style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {profileData.map((result: ProfileDataItem, index: number) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto auto',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  borderBottom:
                    index < profileData.length - 1
                      ? '1px solid #e5e7eb'
                      : 'none',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontWeight: '500' }}>{result.name}</div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: result.duration > 500 ? '#dc2626' : '#166534',
                  }}
                >
                  {result.duration}ms
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {result.memoryDelta
                    ? `${(result.memoryDelta / 1024).toFixed(1)}KB`
                    : 'N/A'}
                </div>
                <div>
                  {result.success ? (
                    <span style={{ color: '#166534' }}>✅</span>
                  ) : (
                    <span style={{ color: '#dc2626' }}>❌</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#f0f9ff',
              borderRadius: '6px',
              fontSize: '0.875rem',
            }}
          >
            <strong>Analysis:</strong>
            <ul style={{ margin: '0.5rem 0 0 1rem' }}>
              <li>
                Total execution time:{' '}
                {profileData.reduce(
                  (sum: number, op: ProfileDataItem) => sum + op.duration,
                  0
                )}
                ms
              </li>
              <li>
                Slowest operation:{' '}
                {profileData.length > 0
                  ? profileData.reduce(
                      (slowest: ProfileDataItem, op: ProfileDataItem) =>
                        op.duration > slowest.duration ? op : slowest,
                      profileData[0]
                    ).name
                  : 'None'}
              </li>
              <li>
                Success rate:{' '}
                {profileData.length > 0
                  ? Math.round(
                      (profileData.filter((op: ProfileDataItem) => op.success)
                        .length /
                        profileData.length) *
                        100
                    )
                  : 0}
                %
              </li>
            </ul>
          </div>
        </div>
      )}

      <CodeSyntaxHighlighter language='typescript'>
        {`// Performance profiling utilities
class PerformanceProfiler {
  async profile<T>(name: string, operation: () => Promise<T>) {
    const startTime = performance.now()
    const startMemory = performance.memory?.usedJSHeapSize || 0
    
    // Start performance mark
    performance.mark(\`\${name}-start\`)
    
    try {
      const result = await operation()
      
      const endTime = performance.now()
      const endMemory = performance.memory?.usedJSHeapSize || 0
      
      // End performance mark and measure
      performance.mark(\`\${name}-end\`)
      performance.measure(name, \`\${name}-start\`, \`\${name}-end\`)
      
      return {
        result,
        profile: {
          duration: endTime - startTime,
          memoryDelta: endMemory - startMemory,
          timestamp: new Date().toISOString()
        }
      }
    } catch (error) {
      performance.mark(\`\${name}-error\`)
      performance.measure(\`\${name}-error\`, \`\${name}-start\`, \`\${name}-error\`)
      
      throw error
    }
  }
  
  getPerformanceEntries(name?: string) {
    return name 
      ? performance.getEntriesByName(name, 'measure')
      : performance.getEntriesByType('measure')
  }
  
  clearProfileData() {
    performance.clearMarks()
    performance.clearMeasures()
  }
}

// React hook for profiling
function useProfiler() {
  const profiler = useRef(new PerformanceProfiler())
  
  return {
    profile: profiler.current.profile.bind(profiler.current),
    getEntries: profiler.current.getPerformanceEntries.bind(profiler.current),
    clear: profiler.current.clearProfileData.bind(profiler.current)
  }
}`}
      </CodeSyntaxHighlighter>
    </DemoContainer>
  )
}

export default PerformanceMonitoringDemo
