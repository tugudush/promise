import { useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoOutput,
  DemoSection,
} from '@/examples/shared'
import { simulateApiCall } from '@/utils/async-helpers'

/**
 * Interactive demo showing conversion from Promise chains to async/await
 * Educational purpose: Compare the two approaches side by side
 */
function AsyncToAwaitConversionDemo() {
  const [promiseResult, setPromiseResult] = useState<string>('')
  const [asyncResult, setAsyncResult] = useState<string>('')
  const [promiseLoading, setPromiseLoading] = useState(false)
  const [asyncLoading, setAsyncLoading] = useState(false)
  const [promiseError, setPromiseError] = useState<string>('')
  const [asyncError, setAsyncError] = useState<string>('')

  // Promise chain approach
  const runPromiseChain = () => {
    setPromiseLoading(true)
    setPromiseError('')
    setPromiseResult('')

    simulateApiCall(1000)
      .then((data) => {
        setPromiseResult(`Step 1: ${data}`)
        return simulateApiCall(800)
      })
      .then((data) => {
        setPromiseResult((prev) => `${prev}\nStep 2: ${data}`)
        return simulateApiCall(600)
      })
      .then((data) => {
        setPromiseResult((prev) => `${prev}\nStep 3: ${data}`)
        setPromiseResult((prev) => `${prev}\n✅ All steps completed!`)
      })
      .catch((error) => {
        setPromiseError(error.message)
      })
      .finally(() => {
        setPromiseLoading(false)
      })
  }

  // Async/await approach
  const runAsyncAwait = async () => {
    setAsyncLoading(true)
    setAsyncError('')
    setAsyncResult('')

    try {
      const step1 = await simulateApiCall(1000)
      setAsyncResult(`Step 1: ${step1}`)

      const step2 = await simulateApiCall(800)
      setAsyncResult((prev) => `${prev}\nStep 2: ${step2}`)

      const step3 = await simulateApiCall(600)
      setAsyncResult((prev) => `${prev}\nStep 3: ${step3}`)
      setAsyncResult((prev) => `${prev}\n✅ All steps completed!`)
    } catch (error) {
      setAsyncError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setAsyncLoading(false)
    }
  }

  return (
    <>
      <DemoSection>
        <h3>🔄 Promise Chain vs Async/Await Comparison</h3>
        <p>
          Click the buttons below to see the same multi-step operation
          implemented with both approaches:
        </p>
      </DemoSection>

      <DemoContainer>
        {/* Promise Chain Section */}
        <div>
          <h4>Promise Chain Approach</h4>
          <CodeSyntaxHighlighter language='javascript'>
            {`function runPromiseChain() {
  setLoading(true)
  
  simulateApiCall(1000)
    .then(data => {
      setResult(\`Step 1: \${data}\`)
      return simulateApiCall(800)
    })
    .then(data => {
      setResult(prev => \`\${prev}\\nStep 2: \${data}\`)
      return simulateApiCall(600)
    })
    .then(data => {
      setResult(prev => \`\${prev}\\nStep 3: \${data}\`)
      setResult(prev => \`\${prev}\\n✅ Completed!\`)
    })
    .catch(error => setError(error.message))
    .finally(() => setLoading(false))
}`}
          </CodeSyntaxHighlighter>

          <DemoButton
            onClick={runPromiseChain}
            disabled={promiseLoading}
            style={{ marginTop: '1rem' }}
          >
            {promiseLoading ? 'Running Promise Chain...' : 'Run Promise Chain'}
          </DemoButton>

          {promiseLoading && <p>⏳ Processing steps...</p>}
          {promiseError && (
            <DemoOutput style={{ background: '#fee2e2', color: '#991b1b' }}>
              Error: {promiseError}
            </DemoOutput>
          )}
          {promiseResult && !promiseError && (
            <DemoOutput>{promiseResult}</DemoOutput>
          )}
        </div>

        {/* Async/Await Section */}
        <div>
          <h4>Async/Await Approach</h4>
          <CodeSyntaxHighlighter language='javascript'>
            {`async function runAsyncAwait() {
  setLoading(true)
  
  try {
    const step1 = await simulateApiCall(1000)
    setResult(\`Step 1: \${step1}\`)

    const step2 = await simulateApiCall(800)
    setResult(prev => \`\${prev}\\nStep 2: \${step2}\`)

    const step3 = await simulateApiCall(600)
    setResult(prev => \`\${prev}\\nStep 3: \${step3}\`)
    setResult(prev => \`\${prev}\\n✅ Completed!\`)
    
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}`}
          </CodeSyntaxHighlighter>

          <DemoButton
            onClick={runAsyncAwait}
            disabled={asyncLoading}
            style={{ marginTop: '1rem' }}
          >
            {asyncLoading ? 'Running Async/Await...' : 'Run Async/Await'}
          </DemoButton>

          {asyncLoading && <p>⏳ Processing steps...</p>}
          {asyncError && (
            <DemoOutput style={{ background: '#fee2e2', color: '#991b1b' }}>
              Error: {asyncError}
            </DemoOutput>
          )}
          {asyncResult && !asyncError && <DemoOutput>{asyncResult}</DemoOutput>}
        </div>
      </DemoContainer>

      <DemoSection>
        <h4>Key Differences:</h4>
        <ul>
          <li>
            <strong>Readability:</strong> Async/await reads more like
            synchronous code
          </li>
          <li>
            <strong>Error Handling:</strong> Single try/catch vs multiple
            .catch() calls
          </li>
          <li>
            <strong>Debugging:</strong> Clearer stack traces with async/await
          </li>
          <li>
            <strong>Nesting:</strong> No nested .then() callbacks with
            async/await
          </li>
        </ul>
      </DemoSection>
    </>
  )
}

export default AsyncToAwaitConversionDemo
