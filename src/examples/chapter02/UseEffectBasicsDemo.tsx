import { useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoOutput,
  DemoSection,
  ExampleTitle,
  StatusIndicator,
} from '@/examples/shared'
import { simulateApiCall } from '@/utils/async-helpers'

/**
 * Demonstrates basic useEffect patterns with async operations
 * Educational focus: Correct and incorrect ways to handle async in useEffect
 */
function UseEffectBasicsDemo() {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Manual trigger for demonstration
  const triggerFetch = () => {
    setLoading(true)
    setError(null)
    setData(null)

    const fetchData = async () => {
      try {
        const result = await simulateApiCall(1500, 'Data loaded successfully!')
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }

  const resetDemo = () => {
    setData(null)
    setError(null)
    setLoading(false)
  }

  return (
    <DemoSection>
      <ExampleTitle>
        Interactive Demo: useEffect with Async Operations
      </ExampleTitle>

      <DemoContainer>
        <div>
          <h4>Try the Demo</h4>
          <DemoButton onClick={triggerFetch} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Data'}
          </DemoButton>
          <DemoButton onClick={resetDemo}>Reset</DemoButton>
        </div>

        <div>
          <h4>Status</h4>
          <StatusIndicator
            status={
              loading ? 'loading' : error ? 'error' : data ? 'success' : 'idle'
            }
          >
            {loading && 'Loading data...'}
            {error && `Error: ${error}`}
            {data && `Success: ${data}`}
            {!loading && !error && !data && 'Ready to fetch data'}
          </StatusIndicator>
        </div>
      </DemoContainer>

      <div>
        <h4>Correct Pattern</h4>
        <CodeSyntaxHighlighter language='typescript' showLanguageLabel>
          {`useEffect(() => {
  // Create async function inside useEffect
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await simulateApiCall(1500, 'Success!')
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  fetchData() // Call the async function
}, []) // Empty dependency array - runs once on mount`}
        </CodeSyntaxHighlighter>
      </div>

      <div>
        <h4>Common Mistakes to Avoid</h4>
        <CodeSyntaxHighlighter language='typescript' showLanguageLabel>
          {`// ❌ DON'T: Make useEffect callback async
useEffect(async () => {
  const data = await fetchData() // This breaks cleanup!
  setData(data)
}, [])

// ❌ DON'T: Missing error handling
useEffect(() => {
  fetchData().then(setData) // Unhandled promise rejection
}, [])

// ❌ DON'T: Forgetting to handle loading states
useEffect(() => {
  fetchData().then(setData).catch(setError)
  // User has no idea something is loading!
}, [])`}
        </CodeSyntaxHighlighter>
      </div>

      <DemoOutput>
        <strong>Key Takeaways:</strong>
        <br />
        • useEffect callback cannot be async directly
        <br />
        • Create async functions inside useEffect
        <br />
        • Always handle loading, success, and error states
        <br />
        • Use empty dependency array [] for mount-only effects
        <br />• Include proper error handling with try-catch
      </DemoOutput>
    </DemoSection>
  )
}

export default UseEffectBasicsDemo
