import { useState } from 'react'

import {
  CodeBlock,
  DemoButton,
  DemoContainer,
  DemoOutput,
  DemoSection,
  ExampleTitle,
  StatusIndicator,
} from '@/examples/shared/TutorialComponents.styles'
import {
  simulateApiCall,
  simulateUnreliableApiCall,
} from '@/utils/async-helpers'

/**
 * Demonstrates different loading state patterns and their UX implications
 * Educational focus: Managing loading, success, and error states effectively
 */
function LoadingStatesDemo() {
  // Basic loading states
  const [basicData, setBasicData] = useState<string | null>(null)
  const [basicLoading, setBasicLoading] = useState(false)
  const [basicError, setBasicError] = useState<string | null>(null)

  // Advanced loading states with progress
  const [advancedData, setAdvancedData] = useState<string | null>(null)
  const [advancedLoading, setAdvancedLoading] = useState(false)
  const [advancedError, setAdvancedError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  // Multiple concurrent operations
  const [operation1, setOperation1] = useState<{
    data: string | null
    loading: boolean
    error: string | null
  }>({ data: null, loading: false, error: null })

  const [operation2, setOperation2] = useState<{
    data: string | null
    loading: boolean
    error: string | null
  }>({ data: null, loading: false, error: null })

  // Basic loading state pattern
  const basicFetch = async () => {
    setBasicLoading(true)
    setBasicError(null)
    setBasicData(null)

    try {
      const result = await simulateApiCall(
        2000,
        'Basic data loaded successfully!'
      )
      setBasicData(result)
    } catch (err) {
      setBasicError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setBasicLoading(false)
    }
  }

  // Advanced loading with progress simulation
  const advancedFetch = async () => {
    setAdvancedLoading(true)
    setAdvancedError(null)
    setAdvancedData(null)
    setProgress(0)

    try {
      // Simulate progress updates
      const totalSteps = 5
      for (let i = 1; i <= totalSteps; i++) {
        await new Promise((resolve) => setTimeout(resolve, 400))
        setProgress((i / totalSteps) * 100)
      }

      const result = await simulateApiCall(
        500,
        'Advanced data with progress loaded!'
      )
      setAdvancedData(result)
    } catch (err) {
      setAdvancedError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAdvancedLoading(false)
      setProgress(0)
    }
  }

  // Concurrent operations
  const fetchConcurrent = async (operationNumber: 1 | 2) => {
    const setter = operationNumber === 1 ? setOperation1 : setOperation2
    const delay = operationNumber === 1 ? 1500 : 2500

    setter((prev) => ({ ...prev, loading: true, error: null, data: null }))

    try {
      const result = await simulateUnreliableApiCall(0.8, delay)
      setter((prev) => ({
        ...prev,
        data: `Operation ${operationNumber}: ${result}`,
        loading: false,
      }))
    } catch (err) {
      setter((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'An error occurred',
        loading: false,
      }))
    }
  }

  const resetAll = () => {
    setBasicData(null)
    setBasicLoading(false)
    setBasicError(null)
    setAdvancedData(null)
    setAdvancedLoading(false)
    setAdvancedError(null)
    setProgress(0)
    setOperation1({ data: null, loading: false, error: null })
    setOperation2({ data: null, loading: false, error: null })
  }

  return (
    <DemoSection>
      <ExampleTitle>Interactive Demo: Loading State Patterns</ExampleTitle>

      <DemoContainer>
        <div>
          <h4>1. Basic Loading States</h4>
          <DemoButton onClick={basicFetch} disabled={basicLoading}>
            {basicLoading ? 'Loading...' : 'Basic Fetch'}
          </DemoButton>

          <StatusIndicator
            status={
              basicLoading
                ? 'loading'
                : basicError
                  ? 'error'
                  : basicData
                    ? 'success'
                    : 'idle'
            }
          >
            {basicLoading && 'Loading data...'}
            {basicError && `Error: ${basicError}`}
            {basicData && `Success: ${basicData}`}
            {!basicLoading && !basicError && !basicData && 'Ready to load'}
          </StatusIndicator>
        </div>

        <div>
          <h4>2. Loading with Progress</h4>
          <DemoButton onClick={advancedFetch} disabled={advancedLoading}>
            {advancedLoading
              ? `Loading ${Math.round(progress)}%`
              : 'Advanced Fetch'}
          </DemoButton>

          {advancedLoading && (
            <div style={{ margin: '1rem 0' }}>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: '#3b82f6',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <small>Step {Math.ceil(progress / 20)} of 5</small>
            </div>
          )}

          <StatusIndicator
            status={
              advancedLoading
                ? 'loading'
                : advancedError
                  ? 'error'
                  : advancedData
                    ? 'success'
                    : 'idle'
            }
          >
            {advancedLoading && `Processing... ${Math.round(progress)}%`}
            {advancedError && `Error: ${advancedError}`}
            {advancedData && `Success: ${advancedData}`}
            {!advancedLoading &&
              !advancedError &&
              !advancedData &&
              'Ready to load with progress'}
          </StatusIndicator>
        </div>
      </DemoContainer>

      <DemoContainer>
        <div>
          <h4>3. Concurrent Operations</h4>
          <DemoButton
            onClick={() => fetchConcurrent(1)}
            disabled={operation1.loading}
          >
            {operation1.loading ? 'Op 1 Loading...' : 'Start Operation 1'}
          </DemoButton>
          <DemoButton
            onClick={() => fetchConcurrent(2)}
            disabled={operation2.loading}
          >
            {operation2.loading ? 'Op 2 Loading...' : 'Start Operation 2'}
          </DemoButton>
          <DemoButton
            onClick={() => {
              fetchConcurrent(1)
              fetchConcurrent(2)
            }}
            disabled={operation1.loading || operation2.loading}
          >
            Start Both
          </DemoButton>
        </div>

        <div>
          <h4>Operation Status</h4>
          <StatusIndicator
            status={
              operation1.loading
                ? 'loading'
                : operation1.error
                  ? 'error'
                  : operation1.data
                    ? 'success'
                    : 'idle'
            }
          >
            {operation1.loading && 'Operation 1: Loading...'}
            {operation1.error && `Operation 1 Error: ${operation1.error}`}
            {operation1.data && operation1.data}
            {!operation1.loading &&
              !operation1.error &&
              !operation1.data &&
              'Operation 1: Ready'}
          </StatusIndicator>

          <StatusIndicator
            status={
              operation2.loading
                ? 'loading'
                : operation2.error
                  ? 'error'
                  : operation2.data
                    ? 'success'
                    : 'idle'
            }
          >
            {operation2.loading && 'Operation 2: Loading...'}
            {operation2.error && `Operation 2 Error: ${operation2.error}`}
            {operation2.data && operation2.data}
            {!operation2.loading &&
              !operation2.error &&
              !operation2.data &&
              'Operation 2: Ready'}
          </StatusIndicator>
        </div>
      </DemoContainer>

      <DemoButton onClick={resetAll}>Reset All Demos</DemoButton>

      <div>
        <h4>Loading State Management Code</h4>
        <CodeBlock>
          {`// 1. Basic pattern with three states
const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

const fetchData = async () => {
  setLoading(true)     // Start loading
  setError(null)       // Clear previous errors
  
  try {
    const result = await apiCall()
    setData(result)    // Success state
  } catch (err) {
    setError(err.message) // Error state
  } finally {
    setLoading(false)  // Always stop loading
  }
}

// 2. Advanced pattern with progress
const [progress, setProgress] = useState(0)

const fetchWithProgress = async () => {
  setLoading(true)
  const totalSteps = 5
  
  for (let i = 1; i <= totalSteps; i++) {
    await processStep(i)
    setProgress((i / totalSteps) * 100)
  }
  
  setLoading(false)
}

// 3. Concurrent operations pattern
const [ops, setOps] = useState({
  op1: { data: null, loading: false, error: null },
  op2: { data: null, loading: false, error: null }
})

const updateOperation = (opKey, updates) => {
  setOps(prev => ({
    ...prev,
    [opKey]: { ...prev[opKey], ...updates }
  }))
}`}
        </CodeBlock>
      </div>

      <DemoOutput>
        <strong>Loading State Best Practices:</strong>
        <br />
        • Always provide visual feedback during async operations
        <br />
        • Use loading states to disable buttons and prevent duplicate requests
        <br />
        • Show progress indicators for long-running operations
        <br />
        • Handle concurrent operations independently
        <br />
        • Clear previous errors before starting new requests
        <br />• Use the "finally" block to ensure loading state is reset
      </DemoOutput>
    </DemoSection>
  )
}

export default LoadingStatesDemo
