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

/**
 * Demonstrates custom Promise patterns and utility functions
 * Shows how to build reusable async patterns for React applications
 */
function CustomPromisePatternsDemo() {
  const [retryStatus, setRetryStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [retryResult, setRetryResult] = useState('')
  const [retryAttempts, setRetryAttempts] = useState(0)

  const [batchStatus, setBatchStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [batchResults, setBatchResults] = useState<string[]>([])

  const [chainStatus, setChainStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [chainProgress, setChainProgress] = useState<string[]>([])

  // Demo function that fails randomly
  const unreliableOperation = async (): Promise<string> => {
    await simulateApiCall(500 + Math.random() * 500)
    
    // 60% failure rate
    if (Math.random() > 0.4) {
      throw new Error('Random service failure')
    }
    
    return `Success! Operation completed at ${new Date().toLocaleTimeString()}`
  }

  // Demo: Retry pattern implementation
  const testRetryPattern = async () => {
    setRetryStatus('loading')
    setRetryResult('')
    setRetryAttempts(0)

    const maxRetries = 4
    const initialDelay = 800
    const backoffMultiplier = 1.5
    let lastError: Error

    try {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          setRetryAttempts(attempt)
          const result = await unreliableOperation()
          setRetryResult(result)
          setRetryStatus('success')
          return
        } catch (error) {
          lastError = error as Error
          
          if (attempt === maxRetries) {
            throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`)
          }

          // Exponential backoff delay
          const delay = initialDelay * Math.pow(backoffMultiplier, attempt - 1)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    } catch (error) {
      setRetryResult(error instanceof Error ? error.message : 'Unknown error')
      setRetryStatus('error')
    }
  }

  // Demo: Batch processing implementation
  const testBatchProcessing = async () => {
    setBatchStatus('loading')
    setBatchResults([])

    const items = Array.from({ length: 10 }, (_, i) => `item-${i + 1}`)
    const batchSize = 3
    const delay = 600
    const results: string[] = []

    const processItem = async (item: string): Promise<string> => {
      await simulateApiCall(200 + Math.random() * 300)
      return `Processed ${item}`
    }

    try {
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize)
        
        // Process batch in parallel
        const batchResults = await Promise.all(batch.map(processItem))
        results.push(...batchResults)
        
        // Delay between batches to avoid rate limits
        if (i + batchSize < items.length) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }

      setBatchResults(results)
      setBatchStatus('success')
    } catch (error) {
      setBatchResults([error instanceof Error ? error.message : 'Batch processing failed'])
      setBatchStatus('error')
    }
  }

  // Demo: Sequential promise chain implementation
  const testPromiseWaterfall = async () => {
    setChainStatus('loading')
    setChainProgress([])

    const tasks = [
      { name: 'Initialize system', delay: 800 },
      { name: 'Load configuration', delay: 600 },
      { name: 'Connect to database', delay: 1000 },
      { name: 'Start services', delay: 400 },
      { name: 'Run health checks', delay: 500 },
    ]

    try {
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i]
        await simulateApiCall(task.delay)
        const result = `${task.name} completed`
        
        setChainProgress(prev => [...prev, `Step ${i + 1}: ${result}`])
      }
      
      setChainStatus('success')
    } catch (error) {
      setChainProgress(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`])
      setChainStatus('error')
    }
  }

  return (
    <DemoSection>
      <ExampleTitle>Custom Promise Patterns</ExampleTitle>

      <p>
        Learn to build reusable Promise utilities that solve common async challenges
        in React applications. These patterns help create more robust and maintainable code.
      </p>

      <ImportantNote>
        <strong>Key Benefits of Custom Promise Utilities:</strong>
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li><strong>Reusability:</strong> Write once, use everywhere</li>
          <li><strong>Consistency:</strong> Standardized error handling and retry logic</li>
          <li><strong>Maintainability:</strong> Centralized async logic</li>
          <li><strong>Testing:</strong> Easier to test isolated utility functions</li>
        </ul>
      </ImportantNote>

      {/* Retry Pattern Demo */}
      <div style={{ marginBottom: '2rem' }}>
        <h4>1. Retry with Exponential Backoff</h4>
        <p>
          Automatically retry failed operations with increasing delays between attempts.
          Perfect for handling transient network failures.
        </p>

        <DemoContainer>
          <DemoButton onClick={testRetryPattern} disabled={retryStatus === 'loading'}>
            Test Retry Pattern
          </DemoButton>

          <StatusIndicator status={retryStatus === 'loading' ? 'pending' : retryStatus === 'success' ? 'fulfilled' : 'rejected'}>
            <strong>Status:</strong> {retryStatus}
            {retryAttempts > 0 && <span> | <strong>Attempts:</strong> {retryAttempts}</span>}
          </StatusIndicator>

          {retryResult && (
            <DemoOutput>
              {retryResult}
            </DemoOutput>
          )}
        </DemoContainer>

        <CodeSyntaxHighlighter language="typescript">
          {`// Retry utility with exponential backoff
const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> => {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        throw new Error(\`Failed after \${maxRetries} attempts: \${lastError.message}\`)
      }

      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = initialDelay * Math.pow(backoffMultiplier, attempt - 1)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

// Usage in React component
const fetchUserDataWithRetry = async () => {
  try {
    const userData = await retryWithBackoff(
      () => fetch('/api/user').then(r => r.json()),
      3, // 3 retries
      1000, // Start with 1 second delay
      2 // Double delay each time
    )
    setUserData(userData)
  } catch (error) {
    setError('Failed to load user data after multiple attempts')
  }
}`}
        </CodeSyntaxHighlighter>
      </div>

      {/* Batch Processing Demo */}
      <div style={{ marginBottom: '2rem' }}>
        <h4>2. Batch Processing</h4>
        <p>
          Process large arrays in smaller batches to avoid overwhelming servers
          or hitting rate limits. Includes configurable delays between batches.
        </p>

        <DemoContainer>
          <DemoButton onClick={testBatchProcessing} disabled={batchStatus === 'loading'}>
            Process 10 Items in Batches
          </DemoButton>

          <StatusIndicator status={batchStatus === 'loading' ? 'pending' : batchStatus === 'success' ? 'fulfilled' : 'rejected'}>
            <strong>Status:</strong> {batchStatus}
            {batchResults.length > 0 && <span> | <strong>Processed:</strong> {batchResults.length} items</span>}
          </StatusIndicator>

          {batchResults.length > 0 && (
            <DemoOutput>
              {batchResults.slice(0, 5).join('\n')}
              {batchResults.length > 5 && `\n... and ${batchResults.length - 5} more items`}
            </DemoOutput>
          )}
        </DemoContainer>

        <CodeSyntaxHighlighter language="typescript">
          {`// Batch processing utility
const processBatch = async <T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 3,
  delay: number = 500
): Promise<R[]> => {
  const results: R[] = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    
    // Process batch in parallel
    const batchResults = await Promise.all(batch.map(processor))
    results.push(...batchResults)
    
    // Delay between batches to avoid rate limits
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  return results
}

// Usage: Upload multiple files with rate limiting
const uploadFiles = async (files: File[]) => {
  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/api/upload', { method: 'POST', body: formData })
    return response.json()
  }

  // Upload 3 files at a time, with 1 second delay between batches
  const results = await processBatch(files, uploadFile, 3, 1000)
  return results
}`}
        </CodeSyntaxHighlighter>
      </div>

      {/* Promise Waterfall Demo */}
      <div style={{ marginBottom: '2rem' }}>
        <h4>3. Sequential Execution (Waterfall)</h4>
        <p>
          Execute promises sequentially where each step depends on the previous one.
          Perfect for initialization sequences and dependent operations.
        </p>

        <DemoContainer>
          <DemoButton onClick={testPromiseWaterfall} disabled={chainStatus === 'loading'}>
            Run Sequential Tasks
          </DemoButton>

          <StatusIndicator status={chainStatus === 'loading' ? 'pending' : chainStatus === 'success' ? 'fulfilled' : 'rejected'}>
            <strong>Status:</strong> {chainStatus}
            {chainProgress.length > 0 && <span> | <strong>Steps completed:</strong> {chainProgress.length}</span>}
          </StatusIndicator>

          {chainProgress.length > 0 && (
            <DemoOutput>
              {chainProgress.join('\n')}
            </DemoOutput>
          )}
        </DemoContainer>

        <CodeSyntaxHighlighter language="typescript">
          {`// Sequential promise execution (waterfall)
const promiseWaterfall = async <T>(
  tasks: (() => Promise<T>)[],
  onProgress?: (result: T, index: number) => void
): Promise<T[]> => {
  const results: T[] = []
  
  for (let i = 0; i < tasks.length; i++) {
    const result = await tasks[i]()
    results.push(result)
    
    if (onProgress) {
      onProgress(result, i)
    }
  }
  
  return results
}

// Usage: App initialization sequence
const initializeApp = async () => {
  const tasks = [
    async () => await loadConfig(),
    async () => await connectDatabase(),
    async () => await startServices(),
    async () => await runHealthChecks(),
  ]

  await promiseWaterfall(tasks, (result, step) => {
    console.log(\`Step \${step + 1} completed:\`, result)
    updateProgressBar((step + 1) / tasks.length * 100)
  })

  console.log('App initialization complete!')
}`}
        </CodeSyntaxHighlighter>
      </div>

      <SuccessNote>
        <strong>Pro Tip:</strong> Combine these patterns for powerful async workflows.
        For example, use batch processing with retry logic for resilient bulk operations,
        or chain multiple retry operations in a waterfall sequence.
      </SuccessNote>
    </DemoSection>
  )
}

export default CustomPromisePatternsDemo
