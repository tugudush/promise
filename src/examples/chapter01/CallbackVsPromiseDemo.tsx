import { useState } from 'react'

import { callbackHellExample, promiseChainExample } from '@/utils/async-helpers'

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
} from '../shared'

/**
 * Demonstrates the problems with callback hell and how Promises solve them
 * Educational focus: Understanding why Promises were created
 */
function CallbackVsPromiseDemo() {
  const [status, setStatus] = useState<
    'idle' | 'running' | 'completed' | 'error'
  >('idle')
  const [output, setOutput] = useState<string>('')
  const [demoType, setDemoType] = useState<'callback' | 'promise' | null>(null)

  const runCallbackExample = () => {
    setStatus('running')
    setDemoType('callback')
    setOutput('Starting callback hell example...')

    callbackHellExample((error, result) => {
      if (error) {
        setStatus('error')
        setOutput(error.message)
      } else {
        setStatus('completed')
        setOutput(`${output}\n${result || 'Completed with callbacks'}`)
      }
    })
  }

  const runPromiseExample = async () => {
    setStatus('running')
    setDemoType('promise')
    setOutput('Starting Promise chain example...')

    try {
      const result = await promiseChainExample()
      setStatus('completed')
      setOutput(result)
    } catch (error) {
      setStatus('error')
      setOutput(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const reset = () => {
    setStatus('idle')
    setOutput('')
    setDemoType(null)
  }

  return (
    <DemoSection>
      <ExampleTitle>Callback Hell vs Promise Chains</ExampleTitle>

      <ImportantNote>
        Before Promises, JavaScript developers used callbacks for async
        operations, which often led to deeply nested code called "callback hell"
        or "pyramid of doom".
      </ImportantNote>

      <DemoContainer>
        <div>
          <h4>Compare the Approaches:</h4>
          <DemoButton
            onClick={runCallbackExample}
            disabled={status === 'running'}
          >
            Run Callback Example
          </DemoButton>

          <DemoButton
            onClick={runPromiseExample}
            disabled={status === 'running'}
          >
            Run Promise Example
          </DemoButton>

          <DemoButton onClick={reset} disabled={status === 'running'}>
            Reset
          </DemoButton>
        </div>

        <div>
          <StatusIndicator status={status}>
            Status: {status} {demoType && `(${demoType} approach)`}
          </StatusIndicator>

          <DemoOutput>
            {output ||
              'Click a button to see the difference between callbacks and Promises'}
          </DemoOutput>
        </div>
      </DemoContainer>

      <CodeSyntaxHighlighter language='javascript' showLanguageLabel>
        {`// ❌ Callback Hell (Hard to read and maintain)
fetchUser(userId, (userError, user) => {
  if (userError) throw userError
  
  fetchUserPreferences(user.id, (prefError, preferences) => {
    if (prefError) throw prefError
    
    fetchUserProfile(user.id, (profileError, profile) => {
      if (profileError) throw profileError
      
      // Finally do something with the data
      displayDashboard(user, preferences, profile)
    })
  })
})

// ✅ Promise Chain (Much cleaner!)
fetchUser(userId)
  .then(user => fetchUserPreferences(user.id))
  .then(preferences => fetchUserProfile(preferences.userId))
  .then(profile => displayDashboard(profile))
  .catch(error => handleError(error))`}
      </CodeSyntaxHighlighter>

      <SuccessNote>
        Promises solve callback hell by providing a cleaner, more readable way
        to handle asynchronous operations. They also provide better error
        handling with .catch().
      </SuccessNote>
    </DemoSection>
  )
}

export default CallbackVsPromiseDemo
