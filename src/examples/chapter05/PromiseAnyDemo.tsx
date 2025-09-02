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

interface AnyResult {
  winner: string
  result: string
  time: number
  attempts: number
  failures?: string[]
}

/**
 * Demonstrates Promise.any() for "first success wins" scenarios
 * Shows fallback strategy where we need at least one success
 */
function PromiseAnyDemo() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [anyResult, setAnyResult] = useState<AnyResult | null>(null)

  // Simulate different data sources with varying reliability
  const fetchFromPrimaryAPI = async (): Promise<string> => {
    await simulateApiCall(800 + Math.random() * 400) // 800-1200ms

    // 30% success rate (unreliable primary)
    if (Math.random() > 0.7) {
      return 'Premium data from Primary API'
    } else {
      throw new Error('Primary API: Rate limit exceeded')
    }
  }

  const fetchFromBackupAPI = async (): Promise<string> => {
    await simulateApiCall(1200 + Math.random() * 600) // 1200-1800ms

    // 60% success rate
    if (Math.random() > 0.4) {
      return 'Standard data from Backup API'
    } else {
      throw new Error('Backup API: Service temporarily unavailable')
    }
  }

  const fetchFromFallbackAPI = async (): Promise<string> => {
    await simulateApiCall(600 + Math.random() * 300) // 600-900ms

    // 80% success rate (most reliable but basic data)
    if (Math.random() > 0.2) {
      return 'Basic data from Fallback API'
    } else {
      throw new Error('Fallback API: Database connection failed')
    }
  }

  const fetchFromCacheAPI = async (): Promise<string> => {
    await simulateApiCall(200 + Math.random() * 200) // 200-400ms (fastest)

    // 90% success rate but might have stale data
    if (Math.random() > 0.1) {
      return 'Cached data (may be stale) from Cache API'
    } else {
      throw new Error('Cache API: Cache miss, no data available')
    }
  }

  const fetchDataWithFallbacks = async () => {
    setStatus('loading')
    setAnyResult(null)
    const startTime = Date.now()

    try {
      // Promise.any resolves with the first successful promise
      // Ignores rejections until all promises reject
      const result = await Promise.any([
        fetchFromPrimaryAPI(),
        fetchFromBackupAPI(),
        fetchFromFallbackAPI(),
        fetchFromCacheAPI(),
      ])

      const endTime = Date.now()
      const executionTime = endTime - startTime

      // Determine which API succeeded based on result content
      let winner = 'Unknown'
      let attempts = 0
      if (result.includes('Primary')) {
        winner = 'Primary API'
        attempts = 1
      } else if (result.includes('Backup')) {
        winner = 'Backup API'
        attempts = 2
      } else if (result.includes('Fallback')) {
        winner = 'Fallback API'
        attempts = 3
      } else if (result.includes('Cache')) {
        winner = 'Cache API'
        attempts = 1 // Cache is usually fastest
      }

      setAnyResult({
        winner,
        result,
        time: executionTime,
        attempts,
      })
      setStatus('success')
    } catch (aggregateError) {
      // This happens when ALL promises reject
      const endTime = Date.now()
      const executionTime = endTime - startTime

      // Get all the failure reasons
      const failures =
        aggregateError instanceof AggregateError
          ? aggregateError.errors.map((err) => err.message)
          : ['All services failed']

      setAnyResult({
        winner: 'None (All Failed)',
        result: 'No data sources available',
        time: executionTime,
        attempts: 4,
        failures,
      })
      setStatus('error')
    }
  }

  const fetchDataMostlyFailing = async () => {
    setStatus('loading')
    setAnyResult(null)
    const startTime = Date.now()

    // Simulate scenario where most services fail
    const alwaysFailAPI1 = async (): Promise<string> => {
      await simulateApiCall(300)
      throw new Error('API 1: Permanent service outage')
    }

    const alwaysFailAPI2 = async (): Promise<string> => {
      await simulateApiCall(500)
      throw new Error('API 2: Authentication failure')
    }

    const eventuallySucceedAPI = async (): Promise<string> => {
      await simulateApiCall(1500) // Takes longer but succeeds
      return 'Success! Data from the only working API'
    }

    const alwaysFailAPI3 = async (): Promise<string> => {
      await simulateApiCall(200)
      throw new Error('API 3: Network timeout')
    }

    try {
      // Promise.any waits for the FIRST success, ignoring failures
      const result = await Promise.any([
        alwaysFailAPI1(),
        alwaysFailAPI2(),
        eventuallySucceedAPI(), // This will succeed after 1500ms
        alwaysFailAPI3(),
      ])

      const endTime = Date.now()
      setAnyResult({
        winner: 'Eventually Succeed API',
        result,
        time: endTime - startTime,
        attempts: 1,
      })
      setStatus('success')
    } catch (aggregateError) {
      const endTime = Date.now()
      const failures =
        aggregateError instanceof AggregateError
          ? aggregateError.errors.map((err) => err.message)
          : ['All services failed']

      setAnyResult({
        winner: 'None (All Failed)',
        result: 'Complete system failure',
        time: endTime - startTime,
        attempts: 4,
        failures,
      })
      setStatus('error')
    }
  }

  return (
    <DemoSection>
      <ExampleTitle>Promise.any() - First Success Wins</ExampleTitle>

      <p>
        <code>Promise.any()</code> resolves with the first successful promise
        and ignores rejections. It only rejects if ALL promises reject, making
        it perfect for implementing robust fallback strategies.
      </p>

      <ImportantNote>
        <strong>Key Characteristics:</strong>
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li key='first-success-wins'>
            <strong>First Success Wins:</strong> Returns the first resolved
            promise
          </li>
          <li key='ignores-failures'>
            <strong>Ignores Failures:</strong> Rejections don't stop the process
          </li>
          <li key='aggregate-rejection'>
            <strong>Aggregate Rejection:</strong> Only fails when ALL promises
            reject
          </li>
          <li key='perfect-for-fallbacks'>
            <strong>Perfect for Fallbacks:</strong> Robust error recovery
            strategies
          </li>
        </ul>
      </ImportantNote>

      <DemoContainer>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <DemoButton
            onClick={fetchDataWithFallbacks}
            disabled={status === 'loading'}
          >
            Fetch with Multiple Fallbacks
          </DemoButton>
          <DemoButton
            onClick={fetchDataMostlyFailing}
            disabled={status === 'loading'}
          >
            Fetch from Mostly Failing APIs
          </DemoButton>
        </div>

        <StatusIndicator
          status={
            status === 'loading'
              ? 'pending'
              : status === 'success'
                ? 'fulfilled'
                : 'rejected'
          }
        >
          <strong>Status:</strong> {status}
          {anyResult && (
            <span>
              {' | '}
              <strong>Winner:</strong> {anyResult.winner} in {anyResult.time}ms
            </span>
          )}
        </StatusIndicator>

        {anyResult && (
          <DemoOutput>
            {status === 'success'
              ? `🎯 First Success: ${anyResult.winner}
📦 Result: ${anyResult.result}
⏱️ Time: ${anyResult.time}ms
🔄 Strategy: First working API provided the data`
              : `💥 All APIs Failed
⏱️ Time: ${anyResult.time}ms
❌ Failed Services:
${anyResult.failures?.map((f) => `   • ${f}`).join('\n')}

🔍 This only happens when ALL promises reject`}
          </DemoOutput>
        )}
      </DemoContainer>

      <h4>React Implementation for Robust Data Fetching</h4>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Robust data fetching with multiple fallbacks
function ResilientDataLoader() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState('')

  const fetchDataResilient = async () => {
    setLoading(true)

    try {
      // Promise.any tries all sources, returns first success
      const result = await Promise.any([
        fetchFromPrimaryAPI().then(data => ({ data, source: 'Primary API' })),
        fetchFromBackupAPI().then(data => ({ data, source: 'Backup API' })),
        fetchFromCacheAPI().then(data => ({ data, source: 'Cache API' })),
        fetchFromFallbackAPI().then(data => ({ data, source: 'Fallback API' })),
      ])

      setData(result.data)
      setDataSource(result.source)
    } catch (aggregateError) {
      // This only happens if ALL sources fail
      console.error('All data sources failed:', aggregateError.errors)
      // Show fallback UI or cached data
      setData('Unable to load data from any source')
      setDataSource('Error state')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={fetchDataResilient} disabled={loading}>
        {loading ? 'Loading...' : 'Load Data'}
      </button>
      
      {data && (
        <div>
          <DataDisplay data={data} />
          <small>Source: {dataSource}</small>
        </div>
      )}
    </div>
  )
}`}
      </CodeSyntaxHighlighter>

      <h4>Promise.any() vs Promise.race() Comparison</h4>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Promise.race() - First to finish (success OR failure) wins
try {
  const result = await Promise.race([
    fastFailingAPI(),     // Fails in 100ms
    slowSuccessAPI(),     // Succeeds in 2000ms
  ])
  // This will throw because fastFailingAPI rejects first
} catch (error) {
  console.log('Race failed:', error) // ← This will run
}

// Promise.any() - First SUCCESS wins, ignores failures
try {
  const result = await Promise.any([
    fastFailingAPI(),     // Fails in 100ms (ignored)
    slowSuccessAPI(),     // Succeeds in 2000ms
  ])
  console.log('Success:', result) // ← This will run after 2000ms
} catch (aggregateError) {
  // Only runs if ALL promises reject
}`}
      </CodeSyntaxHighlighter>

      <h4>When to Use Promise.any()</h4>

      <ul>
        <li key='fallback-strategies'>
          <strong>Fallback Strategies:</strong> Try multiple data sources until
          one succeeds
        </li>
        <li key='cdn-selection'>
          <strong>CDN Selection:</strong> Use fastest available content delivery
          network
        </li>
        <li key='authentication'>
          <strong>Authentication:</strong> Try multiple auth providers until one
          works
        </li>
        <li key='feature-detection'>
          <strong>Feature Detection:</strong> Use first available browser API
        </li>
        <li key='redundant-systems'>
          <strong>Redundant Systems:</strong> Multiple backup systems for
          critical operations
        </li>
      </ul>

      <SuccessNote>
        <strong>Best Practice:</strong> Promise.any() is ideal for building
        resilient applications that gracefully handle service failures. It
        implements the "try until something works" pattern perfectly.
      </SuccessNote>
    </DemoSection>
  )
}

export default PromiseAnyDemo
