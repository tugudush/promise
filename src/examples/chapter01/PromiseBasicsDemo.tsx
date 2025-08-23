import { useState } from 'react'

import { simulateApiCall } from '@/utils/async-helpers'

import {
  CodeBlock,
  DemoButton,
  DemoContainer,
  DemoOutput,
  DemoSection,
  ExampleTitle,
  StatusIndicator,
} from '../shared/TutorialComponents.styles'

/**
 * Interactive demonstration of basic Promise creation and usage
 * Educational focus: Understanding Promise states and lifecycle
 */
function PromiseBasicsDemo() {
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'fulfilled' | 'rejected'
  >('idle')
  const [result, setResult] = useState<string>('')
  const [startTime, setStartTime] = useState<number>(0)

  const handleBasicPromise = async () => {
    setStatus('pending')
    setResult('Promise is now pending...')
    setStartTime(Date.now())

    try {
      const data = await simulateApiCall(2000, 'Hello from your first Promise!')
      setResult(data)
      setStatus('fulfilled')
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Unknown error')
      setStatus('rejected')
    }
  }

  const handlePromiseChain = async () => {
    setStatus('pending')
    setResult('Starting Promise chain...')
    setStartTime(Date.now())

    try {
      const step1 = await simulateApiCall(800, 'Step 1: User authenticated')
      setResult(step1)

      const step2 = await simulateApiCall(800, 'Step 2: Profile loaded')
      setResult((prev) => `${prev}\n${step2}`)

      const step3 = await simulateApiCall(800, 'Step 3: Dashboard ready')
      setResult((prev) => `${prev}\n${step3}`)

      setStatus('fulfilled')
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Unknown error')
      setStatus('rejected')
    }
  }

  const reset = () => {
    setStatus('idle')
    setResult('')
    setStartTime(0)
  }

  const getElapsedTime = () => {
    if (startTime === 0) return 0
    return Math.round((Date.now() - startTime) / 100) / 10
  }

  return (
    <DemoSection>
      <ExampleTitle>Interactive Promise Demonstration</ExampleTitle>

      <DemoContainer>
        <div>
          <h4>Try These Promise Examples:</h4>
          <DemoButton
            onClick={handleBasicPromise}
            disabled={status === 'pending'}
          >
            Basic Promise
          </DemoButton>

          <DemoButton
            onClick={handlePromiseChain}
            disabled={status === 'pending'}
          >
            Promise Chain
          </DemoButton>

          <DemoButton onClick={reset} disabled={status === 'pending'}>
            Reset
          </DemoButton>
        </div>

        <div>
          <StatusIndicator status={status}>
            Status: {status} {status === 'pending' && `(${getElapsedTime()}s)`}
          </StatusIndicator>

          <DemoOutput>
            {result || 'Click a button to see Promise in action'}
          </DemoOutput>
        </div>
      </DemoContainer>

      <CodeBlock>
        {`// Basic Promise Example
const basicPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Hello from your first Promise!')
  }, 2000)
})

// Using the Promise
basicPromise
  .then(result => console.log(result))
  .catch(error => console.error(error))`}
      </CodeBlock>
    </DemoSection>
  )
}

export default PromiseBasicsDemo
