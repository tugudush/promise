import { useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoOutput,
  DemoSection,
} from '@/examples/shared'
import {
  simulateApiCall,
  simulateUnreliableApiCall,
} from '@/utils/async-helpers'

/**
 * Interactive demo showing advanced try/catch patterns with async/await
 * Educational purpose: Demonstrate error handling strategies and recovery patterns
 */
function TryCatchPatternsDemo() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [currentDemo, setCurrentDemo] = useState<string>('')

  // Clear results helper
  const clearResults = () => {
    setResult('')
    setCurrentDemo('')
  }

  // Demo 1: Basic try/catch pattern
  const handleBasicTryCatch = async () => {
    setLoading(true)
    setResult('')
    setCurrentDemo('basic')

    try {
      const data = await simulateUnreliableApiCall(0.3) // 30% success rate
      setResult(`✅ Success: ${data}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setResult(`❌ Error caught: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  // Demo 2: Granular error handling
  const handleGranularErrorHandling = async () => {
    setLoading(true)
    setResult('')
    setCurrentDemo('granular')

    let step = ''
    try {
      step = 'User validation'
      setResult('Step 1: Validating user...')
      await simulateApiCall(500)

      step = 'Data processing'
      setResult((prev) => `${prev}\nStep 2: Processing data...`)
      await simulateUnreliableApiCall(0.7) // 70% success rate

      step = 'Email notification'
      setResult((prev) => `${prev}\nStep 3: Sending notification...`)
      await simulateApiCall(300)

      setResult((prev) => `${prev}\n✅ All steps completed successfully!`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setResult((prev) => `${prev}\n❌ Failed at ${step}: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  // Demo 3: Retry mechanism with exponential backoff
  const handleRetryPattern = async () => {
    setLoading(true)
    setResult('')
    setCurrentDemo('retry')

    const maxRetries = 3
    let attempt = 0
    let delay = 500

    while (attempt < maxRetries) {
      attempt++
      try {
        setResult((prev) => `${prev}Attempt ${attempt}/${maxRetries}...\n`)

        // Use unreliable API with 40% success rate to trigger retries
        const data = await simulateUnreliableApiCall(0.4)
        setResult((prev) => `${prev}✅ Success on attempt ${attempt}: ${data}`)
        setLoading(false)
        return
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        setResult((prev) => `${prev}❌ Attempt ${attempt} failed: ${message}\n`)

        if (attempt === maxRetries) {
          setResult(
            (prev) => `${prev}💥 All ${maxRetries} attempts failed. Giving up.`
          )
          break
        }

        // Wait before next attempt with exponential backoff
        setResult((prev) => `${prev}⏳ Waiting ${delay}ms before retry...\n`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff
      }
    }

    setLoading(false)
  }

  // Demo 4: Partial failure handling
  const handlePartialFailure = async () => {
    setLoading(true)
    setResult('')
    setCurrentDemo('partial')

    const results = {
      userProfile: null as string | null,
      userPosts: null as string | null,
      userFriends: null as string | null,
      criticalData: null as string | null,
    }

    // Step 1: Critical data (must succeed)
    try {
      setResult('Loading critical data (must succeed)...')
      await simulateApiCall(600)
      results.criticalData = 'Critical data loaded'
      setResult((prev) => `${prev}\n✅ Critical data: Success`)
    } catch {
      setResult(
        (prev) => `${prev}\n❌ Critical data failed - aborting entire operation`
      )
      setLoading(false)
      return
    }

    // Step 2: User profile (important but not critical)
    try {
      setResult((prev) => `${prev}\nLoading user profile...`)
      await simulateUnreliableApiCall(0.6)
      results.userProfile = 'Profile data loaded'
      setResult((prev) => `${prev}\n✅ User profile: Success`)
    } catch {
      setResult((prev) => `${prev}\n⚠️ User profile failed - continuing anyway`)
    }

    // Step 3: User posts (nice to have)
    try {
      setResult((prev) => `${prev}\nLoading user posts...`)
      await simulateUnreliableApiCall(0.5)
      results.userPosts = 'Posts data loaded'
      setResult((prev) => `${prev}\n✅ User posts: Success`)
    } catch {
      setResult((prev) => `${prev}\n⚠️ User posts failed - using cached data`)
      results.userPosts = 'Cached posts data'
    }

    // Step 4: Friends data (optional)
    try {
      setResult((prev) => `${prev}\nLoading friends data...`)
      await simulateUnreliableApiCall(0.4)
      results.userFriends = 'Friends data loaded'
      setResult((prev) => `${prev}\n✅ Friends data: Success`)
    } catch {
      setResult((prev) => `${prev}\n⚠️ Friends data failed - will load later`)
    }

    setResult((prev) => `${prev}\n\n📊 Final Results:`)
    Object.entries(results).forEach(([key, value]) => {
      if (value) {
        setResult((prev) => `${prev}\n• ${key}: ${value}`)
      } else {
        setResult((prev) => `${prev}\n• ${key}: Not available`)
      }
    })

    setLoading(false)
  }

  return (
    <DemoSection>
      <h3>🛠️ Advanced Try/Catch Patterns</h3>
      <p>
        Explore different error handling strategies and recovery patterns with
        async/await:
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <DemoButton onClick={handleBasicTryCatch} disabled={loading}>
          Basic Try/Catch
        </DemoButton>

        <DemoButton onClick={handleGranularErrorHandling} disabled={loading}>
          Granular Handling
        </DemoButton>

        <DemoButton onClick={handleRetryPattern} disabled={loading}>
          Retry Pattern
        </DemoButton>

        <DemoButton onClick={handlePartialFailure} disabled={loading}>
          Partial Failure
        </DemoButton>

        <DemoButton
          onClick={clearResults}
          disabled={loading}
          style={{ background: '#6b7280' }}
        >
          Clear Results
        </DemoButton>
      </div>

      {result && (
        <DemoOutput style={{ marginBottom: '1.5rem' }}>{result}</DemoOutput>
      )}

      {currentDemo && (
        <div>
          <h4>Code Pattern for "{currentDemo}" demo:</h4>
          {currentDemo === 'basic' && (
            <CodeSyntaxHighlighter language='typescript'>
              {`// Basic try/catch pattern
async function basicOperation() {
  try {
    const result = await someAsyncOperation()
    setData(result)
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}`}
            </CodeSyntaxHighlighter>
          )}

          {currentDemo === 'granular' && (
            <CodeSyntaxHighlighter language='typescript'>
              {`// Granular error handling for multi-step operations
async function multiStepOperation() {
  let currentStep = ''
  
  try {
    currentStep = 'validation'
    await validateInput()
    
    currentStep = 'processing' 
    await processData()
    
    currentStep = 'notification'
    await sendNotification()
    
  } catch (error) {
    console.error(\`Failed at \${currentStep}: \${error.message}\`)
    throw new Error(\`Operation failed during \${currentStep}\`)
  }
}`}
            </CodeSyntaxHighlighter>
          )}

          {currentDemo === 'retry' && (
            <CodeSyntaxHighlighter language='typescript'>
              {`// Retry pattern with exponential backoff
async function retryOperation(maxRetries = 3) {
  let attempt = 0
  let delay = 500
  
  while (attempt < maxRetries) {
    attempt++
    
    try {
      return await unreliableOperation()
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(\`Failed after \${maxRetries} attempts\`)
      }
      
      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= 2 // Exponential backoff
    }
  }
}`}
            </CodeSyntaxHighlighter>
          )}

          {currentDemo === 'partial' && (
            <CodeSyntaxHighlighter language='typescript'>
              {`// Partial failure handling
async function loadDashboardData() {
  const results = { critical: null, optional: null }
  
  // Critical operation - must succeed
  try {
    results.critical = await loadCriticalData()
  } catch (error) {
    throw new Error('Critical operation failed')
  }
  
  // Optional operation - can fail gracefully
  try {
    results.optional = await loadOptionalData()
  } catch (error) {
    console.warn('Optional data failed, using fallback')
    results.optional = getFallbackData()
  }
  
  return results
}`}
            </CodeSyntaxHighlighter>
          )}
        </div>
      )}
    </DemoSection>
  )
}

export default TryCatchPatternsDemo
