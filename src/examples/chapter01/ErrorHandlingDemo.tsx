import { useState } from 'react'

import { simulateUnreliableApiCall } from '@/utils/async-helpers'

import {
  CodeBlock,
  DemoButton,
  DemoContainer,
  DemoOutput,
  DemoSection,
  ExampleTitle,
  LearningObjective,
  StatusIndicator,
} from '../shared/TutorialComponents.styles'

/**
 * Interactive demonstration of Promise error handling
 * Educational focus: Understanding Promise rejection and error handling patterns
 */
function ErrorHandlingDemo() {
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle')
  const [result, setResult] = useState<string>('')
  const [errorDetails, setErrorDetails] = useState<string>('')
  const [attempts, setAttempts] = useState<number>(0)

  const testErrorHandling = async () => {
    const currentAttempt = attempts + 1
    setAttempts(currentAttempt)
    setStatus('pending')
    setResult(`Attempt ${currentAttempt}: Testing error handling...`)
    setErrorDetails('')

    try {
      // 60% success rate - will fail sometimes
      const data = await simulateUnreliableApiCall(0.6, 1500)
      setStatus('success')
      setResult(`Attempt ${currentAttempt}: ${data}`)
    } catch (error) {
      setStatus('error')
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      setResult(`Attempt ${currentAttempt}: Operation failed`)
      setErrorDetails(errorMessage)
    }
  }

  const testMultipleErrors = async () => {
    setStatus('pending')
    setResult('Testing multiple error scenarios...')
    setErrorDetails('')
    setAttempts(0)

    const scenarios = [
      { name: 'Network timeout', successRate: 0 },
      { name: 'Server error', successRate: 0 },
      { name: 'Successful request', successRate: 1 },
    ]

    let results = ''

    for (let i = 0; i < scenarios.length; i++) {
      const scenario = scenarios[i]

      try {
        results += `\n${i + 1}. ${scenario.name}: `
        await simulateUnreliableApiCall(scenario.successRate, 800)
        results += 'Success ✅'
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        results += `Failed ❌ (${errorMessage})`
      }
    }

    setStatus('success')
    setResult(results.trim())
  }

  const reset = () => {
    setStatus('idle')
    setResult('')
    setErrorDetails('')
    setAttempts(0)
  }

  return (
    <DemoSection>
      <ExampleTitle>Promise Error Handling</ExampleTitle>

      <LearningObjective>
        Learn how Promises handle errors through rejection and how to catch and
        handle them gracefully.
      </LearningObjective>

      <DemoContainer>
        <div>
          <h4>Try Error Handling:</h4>
          <DemoButton
            onClick={testErrorHandling}
            disabled={status === 'pending'}
          >
            Test Random Success/Failure
          </DemoButton>

          <DemoButton
            onClick={testMultipleErrors}
            disabled={status === 'pending'}
          >
            Test Multiple Scenarios
          </DemoButton>

          <DemoButton onClick={reset} disabled={status === 'pending'}>
            Reset
          </DemoButton>

          {attempts > 0 && (
            <p
              style={{ marginTop: '1rem', fontSize: '0.9em', color: '#6b7280' }}
            >
              Total attempts: {attempts}
            </p>
          )}
        </div>

        <div>
          <StatusIndicator status={status === 'success' ? 'fulfilled' : status}>
            Status: {status === 'success' ? 'completed' : status}
          </StatusIndicator>

          <DemoOutput>
            {result || 'Click a button to test Promise error handling'}
            {errorDetails && (
              <>
                {'\n\n'}
                <span style={{ color: '#ef4444' }}>
                  Error Details: {errorDetails}
                </span>
              </>
            )}
          </DemoOutput>
        </div>
      </DemoContainer>

      <CodeBlock>
        {`// Promise Error Handling Patterns

// 1. Using .catch() method
fetchData()
  .then(result => {
    console.log('Success:', result)
  })
  .catch(error => {
    console.error('Error:', error.message)
  })

// 2. Using try/catch with async/await
async function handleAsyncOperation() {
  try {
    const result = await fetchData()
    console.log('Success:', result)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

// 3. Handling specific error types
fetchData()
  .catch(error => {
    if (error.name === 'NetworkError') {
      console.log('Check your internet connection')
    } else if (error.status === 404) {
      console.log('Resource not found')
    } else {
      console.log('Unexpected error:', error.message)
    }
  })`}
      </CodeBlock>
    </DemoSection>
  )
}

export default ErrorHandlingDemo
