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

interface RaceResult {
  winner: string
  result: string
  time: number
  reason?: string
}

/**
 * Demonstrates Promise.race() for timeout handling and competitive scenarios
 * Shows multiple server requests where fastest response wins
 */
function PromiseRaceDemo() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [raceResult, setRaceResult] = useState<RaceResult | null>(null)
  const [allResults, setAllResults] = useState<string[]>([])

  // Simulate fetching from different servers with varying speeds
  const fetchFromPrimaryServer = async (): Promise<string> => {
    await simulateApiCall(1200 + Math.random() * 800) // 1200-2000ms
    return 'Data from Primary Server (US-East)'
  }

  const fetchFromSecondaryServer = async (): Promise<string> => {
    await simulateApiCall(800 + Math.random() * 600) // 800-1400ms
    return 'Data from Secondary Server (EU-West)'
  }

  const fetchFromTertiaryServer = async (): Promise<string> => {
    await simulateApiCall(600 + Math.random() * 900) // 600-1500ms
    return 'Data from Tertiary Server (Asia-Pacific)'
  }

  // Create a timeout promise for demonstration
  const createTimeoutPromise = (ms: number): Promise<never> => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timed out after ${ms}ms`))
      }, ms)
    })
  }

  const raceServersWithTimeout = async () => {
    setStatus('loading')
    setRaceResult(null)
    setAllResults([])
    const startTime = Date.now()

    try {
      // Promise.race - first to resolve OR reject wins
      const result = await Promise.race([
        fetchFromPrimaryServer(),
        fetchFromSecondaryServer(),
        fetchFromTertiaryServer(),
        createTimeoutPromise(2500), // 2.5 second timeout
      ])

      const endTime = Date.now()
      const executionTime = endTime - startTime

      // Determine which server won based on the result
      let winner = 'Unknown'
      if (result.includes('Primary')) winner = 'Primary Server'
      else if (result.includes('Secondary')) winner = 'Secondary Server'
      else if (result.includes('Tertiary')) winner = 'Tertiary Server'

      setRaceResult({
        winner,
        result,
        time: executionTime,
      })
      setStatus('success')

      // Log what all servers would have returned (for educational purposes)
      collectAllResults()
    } catch (error) {
      const endTime = Date.now()
      const executionTime = endTime - startTime

      setRaceResult({
        winner: 'Timeout',
        result: 'Request failed',
        time: executionTime,
        reason: error instanceof Error ? error.message : 'Unknown error',
      })
      setStatus('error')
    }
  }

  // For educational purposes, show what all servers would return
  const collectAllResults = async () => {
    try {
      const results = await Promise.allSettled([
        fetchFromPrimaryServer(),
        fetchFromSecondaryServer(),
        fetchFromTertiaryServer(),
      ])

      const resultStrings = results.map((result, index) => {
        const serverNames = ['Primary', 'Secondary', 'Tertiary']
        if (result.status === 'fulfilled') {
          return `${serverNames[index]}: ${result.value}`
        } else {
          return `${serverNames[index]}: Failed - ${result.reason}`
        }
      })

      setAllResults(resultStrings)
    } catch {
      setAllResults(['Error collecting results'])
    }
  }

  const raceWithFailingServer = async () => {
    setStatus('loading')
    setRaceResult(null)
    setAllResults([])
    const startTime = Date.now()

    // Simulate a server that fails quickly
    const fastFailingServer = async (): Promise<string> => {
      await simulateApiCall(300)
      throw new Error('Fast server failed: Service unavailable')
    }

    try {
      // If the fastest server fails, the race rejects immediately
      const result = await Promise.race([
        fastFailingServer(), // This will fail after 300ms
        fetchFromPrimaryServer(),
        fetchFromSecondaryServer(),
      ])

      const endTime = Date.now()
      setRaceResult({
        winner: 'Unexpected success',
        result,
        time: endTime - startTime,
      })
      setStatus('success')
    } catch (error) {
      const endTime = Date.now()
      setRaceResult({
        winner: 'Failed Server',
        result: 'Race failed',
        time: endTime - startTime,
        reason: error instanceof Error ? error.message : 'Unknown error',
      })
      setStatus('error')
    }
  }

  return (
    <DemoSection>
      <ExampleTitle>Promise.race() - First to Finish Wins</ExampleTitle>

      <p>
        <code>Promise.race()</code> returns a promise that resolves or rejects
        as soon as one of the input promises resolves or rejects. It's perfect
        for implementing timeouts or choosing the fastest available service.
      </p>

      <ImportantNote>
        <strong>Key Characteristics:</strong>
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li>
            <strong>First to Finish:</strong> Resolves/rejects with the first
            settled promise
          </li>
          <li>
            <strong>Winner Takes All:</strong> Other promises are ignored (but
            still run)
          </li>
          <li>
            <strong>Fails Fast:</strong> If fastest promise rejects, entire race
            rejects
          </li>
          <li>
            <strong>Perfect for Timeouts:</strong> Race data request vs timeout
            promise
          </li>
        </ul>
      </ImportantNote>

      <DemoContainer>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <DemoButton
            onClick={raceServersWithTimeout}
            disabled={status === 'loading'}
          >
            Race Servers (With Timeout)
          </DemoButton>
          <DemoButton
            onClick={raceWithFailingServer}
            disabled={status === 'loading'}
          >
            Race With Failing Server
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
          {raceResult && (
            <span>
              {' '}
              | <strong>Winner:</strong> {raceResult.winner} in{' '}
              {raceResult.time}ms
            </span>
          )}
        </StatusIndicator>

        {raceResult && (
          <DemoOutput>
            {status === 'success'
              ? `🏆 Winner: ${raceResult.winner}
📦 Result: ${raceResult.result}
⏱️ Time: ${raceResult.time}ms`
              : `❌ Race Failed: ${raceResult.reason}
⏱️ Time: ${raceResult.time}ms
💡 The fastest promise rejected, causing the entire race to fail`}
          </DemoOutput>
        )}

        {allResults.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h5 style={{ margin: '0 0 0.5rem 0' }}>
              All Server Results (for comparison):
            </h5>
            <DemoOutput>{allResults.join('\n')}</DemoOutput>
          </div>
        )}
      </DemoContainer>

      <h4>React Implementation with Timeout</h4>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Data fetcher with timeout using Promise.race
function DataFetcher() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchDataWithTimeout = async () => {
    setLoading(true)
    setError(null)

    try {
      // Race data fetching against timeout
      const result = await Promise.race([
        // Multiple data sources
        fetchFromPrimaryAPI(),
        fetchFromBackupAPI(),
        fetchFromCacheAPI(),
        // Timeout after 5 seconds
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        ),
      ])

      setData(result)
    } catch (error) {
      setError(error.message)
      // Could implement fallback logic here
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={fetchDataWithTimeout} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {data && <DataDisplay data={data} />}
    </div>
  )
}`}
      </CodeSyntaxHighlighter>

      <h4>Common Promise.race() Patterns</h4>

      <CodeSyntaxHighlighter language='typescript'>
        {`// 1. Timeout Pattern
const fetchWithTimeout = (url: string, timeoutMs: number) => {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    ),
  ])
}

// 2. Fastest Mirror Pattern
const fetchFromFastestMirror = () => {
  return Promise.race([
    fetch('https://api-us.example.com/data'),
    fetch('https://api-eu.example.com/data'),
    fetch('https://api-asia.example.com/data'),
  ])
}

// 3. User Interaction Timeout
const waitForUserAction = () => {
  return Promise.race([
    userClickPromise(),
    new Promise(resolve => setTimeout(() => resolve('auto-continue'), 10000)),
  ])
}`}
      </CodeSyntaxHighlighter>

      <h4>When to Use Promise.race()</h4>

      <ul>
        <li>
          <strong>Timeouts:</strong> Ensure requests don't hang indefinitely
        </li>
        <li>
          <strong>Multiple Data Sources:</strong> Use fastest available API
        </li>
        <li>
          <strong>User Experience:</strong> Show content as soon as any source
          responds
        </li>
        <li>
          <strong>Failover Systems:</strong> Switch to backup when primary is
          slow
        </li>
        <li>
          <strong>Performance Optimization:</strong> Choose fastest CDN or
          server
        </li>
      </ul>

      <SuccessNote>
        <strong>Pro Tip:</strong> Combine Promise.race() with Promise.any() for
        more sophisticated fallback strategies. Use race for timeouts, and any
        for "first success wins" scenarios.
      </SuccessNote>
    </DemoSection>
  )
}

export default PromiseRaceDemo
