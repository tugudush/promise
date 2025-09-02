import { useCallback, useEffect, useRef, useState } from 'react'

import { CodeSyntaxHighlighter } from '@/examples/shared'
import {
  DemoButton,
  DemoContainer,
  DemoOutput,
  DemoSection,
  ExampleTitle,
  StatusIndicator,
} from '@/examples/shared/TutorialComponents.styles'

interface WorkerTask {
  id: string
  type: 'fibonacci' | 'prime' | 'sort' | 'image-processing'
  input: number | number[]
  status: 'pending' | 'running' | 'completed' | 'error'
  result?: number | number[]
  error?: string
  startTime?: number
  endTime?: number
}

interface BackgroundSyncJob {
  id: string
  type: 'data-sync' | 'cache-update' | 'backup'
  status: 'queued' | 'running' | 'completed' | 'failed'
  progress: number
  message: string
}

export function WebWorkersDemo() {
  const [workerTasks, setWorkerTasks] = useState<WorkerTask[]>([])
  const [syncJobs, setSyncJobs] = useState<BackgroundSyncJob[]>([])
  const [isWorkerSupported, setIsWorkerSupported] = useState(false)
  const [workerOutput, setWorkerOutput] = useState<string>('')
  const workerRef = useRef<Worker | null>(null)
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Check Web Worker support
  useEffect(() => {
    setIsWorkerSupported(typeof Worker !== 'undefined')
  }, [])

  // Create and manage Web Worker
  useEffect(() => {
    if (!isWorkerSupported) return

    // Create a simple Web Worker inline for demo purposes
    const workerCode = `
      self.onmessage = function(e) {
        const { id, type, input } = e.data;
        
        try {
          let result;
          
          switch (type) {
            case 'fibonacci':
              result = calculateFibonacci(input);
              break;
            case 'prime':
              result = findPrimes(input);
              break;
            case 'sort':
              result = sortArray(input);
              break;
            default:
              throw new Error('[EDUCATIONAL DEMO] Unknown task type: ' + type);
          }
          
          self.postMessage({
            id,
            type: 'success',
            result,
          });
        } catch (error) {
          self.postMessage({
            id,
            type: 'error',
            error: error.message,
          });
        }
      };
      
      function calculateFibonacci(n) {
        if (n <= 1) return n;
        let a = 0, b = 1, temp;
        for (let i = 2; i <= n; i++) {
          temp = a + b;
          a = b;
          b = temp;
        }
        return b;
      }
      
      function findPrimes(limit) {
        const primes = [];
        const sieve = new Array(limit + 1).fill(true);
        sieve[0] = sieve[1] = false;
        
        for (let i = 2; i <= limit; i++) {
          if (sieve[i]) {
            primes.push(i);
            for (let j = i * i; j <= limit; j += i) {
              sieve[j] = false;
            }
          }
        }
        return primes;
      }
      
      function sortArray(arr) {
        // Simulate heavy sorting operation
        return arr.sort((a, b) => a - b);
      }
    `

    const blob = new Blob([workerCode], { type: 'application/javascript' })
    workerRef.current = new Worker(URL.createObjectURL(blob))

    workerRef.current.onmessage = (e) => {
      const { id, type, result, error } = e.data

      setWorkerTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                status: type === 'success' ? 'completed' : 'error',
                result: type === 'success' ? result : undefined,
                error: type === 'error' ? error : undefined,
                endTime: Date.now(),
              }
            : task
        )
      )

      if (type === 'success') {
        setWorkerOutput(
          (prev) =>
            prev + `\n✅ Task ${id} completed: ${JSON.stringify(result)}`
        )
      } else {
        setWorkerOutput((prev) => prev + `\n❌ Task ${id} failed: ${error}`)
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
  }, [isWorkerSupported])

  // Background sync simulation
  useEffect(() => {
    if (syncJobs.length === 0) return

    syncIntervalRef.current = setInterval(() => {
      setSyncJobs((prev) =>
        prev.map((job) => {
          if (job.status === 'running' && job.progress < 100) {
            const newProgress = Math.min(job.progress + Math.random() * 20, 100)
            return {
              ...job,
              progress: Math.round(newProgress),
              status: newProgress >= 100 ? 'completed' : 'running',
              message:
                newProgress >= 100
                  ? `${job.type} completed successfully`
                  : `${job.type} in progress... ${Math.round(newProgress)}%`,
            }
          }
          return job
        })
      )
    }, 1000)

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [syncJobs])

  const runWorkerTask = useCallback(
    (type: WorkerTask['type'], input: number | number[]) => {
      if (!workerRef.current) return

      const task: WorkerTask = {
        id: `${type}-${Date.now()}`,
        type,
        input,
        status: 'running',
        startTime: Date.now(),
      }

      setWorkerTasks((prev) => [...prev, task])
      setWorkerOutput(
        (prev) =>
          prev +
          `\n🚀 Starting ${type} task with input: ${JSON.stringify(input)}`
      )

      workerRef.current.postMessage({
        id: task.id,
        type,
        input,
      })
    },
    []
  )

  const startBackgroundSync = useCallback((type: BackgroundSyncJob['type']) => {
    const job: BackgroundSyncJob = {
      id: `sync-${Date.now()}`,
      type,
      status: 'running',
      progress: 0,
      message: `Starting ${type}...`,
    }

    setSyncJobs((prev) => [...prev, job])
  }, [])

  const clearTasks = useCallback(() => {
    setWorkerTasks([])
    setWorkerOutput('')
  }, [])

  const clearSyncJobs = useCallback(() => {
    setSyncJobs([])
  }, [])

  return (
    <DemoContainer>
      <ExampleTitle>8.3 Background Tasks and Web Workers</ExampleTitle>

      {!isWorkerSupported && (
        <StatusIndicator status='rejected'>
          Web Workers are not supported in this environment
        </StatusIndicator>
      )}

      <DemoSection>
        <h4>CPU-Intensive Tasks with Web Workers</h4>
        <p>
          Offload heavy computations to Web Workers to keep the main thread
          responsive:
        </p>

        <CodeSyntaxHighlighter language='typescript' showLanguageLabel>
          {`// Web Worker Hook for Heavy Computations
function useWebWorker<T, R>(workerScript: string) {
  const workerRef = useRef<Worker | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<R | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Create worker from script URL or inline code
    const worker = new Worker(workerScript)
    workerRef.current = worker

    worker.onmessage = (e) => {
      const { type, result, error } = e.data
      
      if (type === 'success') {
        setResult(result)
        setError(null)
      } else if (type === 'error') {
        setError(new Error(error))
        setResult(null)
      }
      
      setIsProcessing(false)
    }

    worker.onerror = (error) => {
      setError(error)
      setIsProcessing(false)
    }

    return () => {
      worker.terminate()
    }
  }, [workerScript])

  const executeTask = useCallback((data: T) => {
    if (!workerRef.current) return

    setIsProcessing(true)
    setError(null)
    setResult(null)

    workerRef.current.postMessage(data)
  }, [])

  return { executeTask, result, error, isProcessing }
}

// Usage in component
function HeavyComputationComponent() {
  const { executeTask, result, error, isProcessing } = useWebWorker('/workers/fibonacci-worker.js')

  const calculateFibonacci = () => {
    executeTask({ type: 'fibonacci', n: 40 })
  }

  return (
    <div>
      <button onClick={calculateFibonacci} disabled={isProcessing}>
        {isProcessing ? 'Computing...' : 'Calculate Fibonacci(40)'}
      </button>
      {result && <div>Result: {result}</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  )
}`}
        </CodeSyntaxHighlighter>

        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <DemoButton
            onClick={() => runWorkerTask('fibonacci', 35)}
            disabled={!isWorkerSupported}
          >
            Calculate Fibonacci(35)
          </DemoButton>
          <DemoButton
            onClick={() => runWorkerTask('prime', 10000)}
            disabled={!isWorkerSupported}
          >
            Find Primes up to 10,000
          </DemoButton>
          <DemoButton
            onClick={() =>
              runWorkerTask(
                'sort',
                Array.from({ length: 100000 }, () => Math.random())
              )
            }
            disabled={!isWorkerSupported}
          >
            Sort 100k Numbers
          </DemoButton>
          <DemoButton onClick={clearTasks}>Clear Tasks</DemoButton>
        </div>

        {workerTasks.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h5>Worker Tasks:</h5>
            {workerTasks.map((task) => (
              <div key={task.id} style={{ marginBottom: '0.5rem' }}>
                <StatusIndicator
                  status={
                    task.status === 'completed'
                      ? 'fulfilled'
                      : task.status === 'error'
                        ? 'rejected'
                        : 'pending'
                  }
                >
                  {task.type} - {task.status}
                  {task.endTime &&
                    task.startTime &&
                    ` (${task.endTime - task.startTime}ms)`}
                </StatusIndicator>
              </div>
            ))}
          </div>
        )}

        {workerOutput && <DemoOutput>{workerOutput}</DemoOutput>}
      </DemoSection>

      <DemoSection>
        <h4>Background Synchronization</h4>
        <p>
          Implement background data sync and cache updates without blocking the
          UI:
        </p>

        <CodeSyntaxHighlighter language='typescript'>
          {`// Background Sync Service
class BackgroundSyncService {
  private syncQueue: SyncJob[] = []
  private isRunning = false

  async scheduleSync(job: SyncJob): Promise<void> {
    this.syncQueue.push(job)
    
    if (!this.isRunning) {
      await this.processSyncQueue()
    }
  }

  private async processSyncQueue(): Promise<void> {
    this.isRunning = true

    while (this.syncQueue.length > 0) {
      const job = this.syncQueue.shift()!
      
      try {
        await this.executeJob(job)
        this.notifyJobComplete(job, 'success')
      } catch (error) {
        this.notifyJobComplete(job, 'error', error)
        
        // Retry logic for failed jobs
        if (job.retryCount < 3) {
          job.retryCount++
          this.syncQueue.push(job)
        }
      }
      
      // Yield control between jobs
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    this.isRunning = false
  }

  private async executeJob(job: SyncJob): Promise<void> {
    switch (job.type) {
      case 'data-sync':
        await this.syncUserData()
        break
      case 'cache-update':
        await this.updateCache()
        break
      case 'backup':
        await this.backupLocalData()
        break
      default:
        throw new Error(\`Unknown job type: \${job.type}\`)
    }
  }
}

// React Hook for Background Sync
function useBackgroundSync() {
  const [syncService] = useState(() => new BackgroundSyncService())
  const [activeSyncs, setActiveSyncs] = useState<SyncJob[]>([])

  const scheduleDataSync = useCallback(() => {
    const job = {
      id: \`sync-\${Date.now()}\`,
      type: 'data-sync',
      status: 'queued',
      retryCount: 0,
    }
    
    syncService.scheduleSync(job)
    setActiveSyncs(prev => [...prev, job])
  }, [syncService])

  return { scheduleDataSync, activeSyncs }
}`}
        </CodeSyntaxHighlighter>

        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <DemoButton onClick={() => startBackgroundSync('data-sync')}>
            Start Data Sync
          </DemoButton>
          <DemoButton onClick={() => startBackgroundSync('cache-update')}>
            Update Cache
          </DemoButton>
          <DemoButton onClick={() => startBackgroundSync('backup')}>
            Backup Data
          </DemoButton>
          <DemoButton onClick={clearSyncJobs}>Clear Jobs</DemoButton>
        </div>

        {syncJobs.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h5>Background Jobs:</h5>
            {syncJobs.map((job) => (
              <div key={job.id} style={{ marginBottom: '1rem' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>{job.type}</span>
                  <span>{job.progress}%</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginTop: '0.25rem',
                  }}
                >
                  <div
                    style={{
                      width: `${job.progress}%`,
                      height: '100%',
                      backgroundColor:
                        job.status === 'completed'
                          ? '#10b981'
                          : job.status === 'failed'
                            ? '#ef4444'
                            : '#3b82f6',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginTop: '0.25rem',
                  }}
                >
                  {job.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </DemoSection>

      <DemoSection>
        <h4>Service Worker Integration</h4>
        <p>
          Service Workers enable offline functionality and background
          processing:
        </p>

        <CodeSyntaxHighlighter language='typescript'>
          {`// Service Worker Registration and Management
class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null

  async register(scriptURL: string): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Workers not supported')
    }

    try {
      this.registration = await navigator.serviceWorker.register(scriptURL)
      
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing
        
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Notify user about app update
            this.notifyUpdate()
          }
        })
      })

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', this.handleMessage)
      
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      throw error
    }
  }

  async sendMessage(message: any): Promise<any> {
    if (!this.registration?.active) {
      throw new Error('Service Worker not active')
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel()
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data)
      }

      this.registration!.active!.postMessage(message, [messageChannel.port2])
    })
  }

  private handleMessage = (event: MessageEvent) => {
    const { type, payload } = event.data

    switch (type) {
      case 'background-sync-complete':
        this.notifyBackgroundSyncComplete(payload)
        break
      case 'cache-updated':
        this.notifyCacheUpdated(payload)
        break
      default:
        console.log('Unknown message from service worker:', event.data)
    }
  }

  private notifyUpdate() {
    // Show update notification to user
    if (confirm('App update available. Reload to update?')) {
      window.location.reload()
    }
  }
}

// React Hook for Service Worker
function useServiceWorker(scriptURL: string) {
  const [isSupported, setIsSupported] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [manager] = useState(() => new ServiceWorkerManager())

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator)
    
    if ('serviceWorker' in navigator) {
      manager.register(scriptURL)
        .then(() => setIsRegistered(true))
        .catch(console.error)
    }
  }, [scriptURL, manager])

  const sendMessage = useCallback(async (message: any) => {
    if (!isRegistered) return null
    return manager.sendMessage(message)
  }, [isRegistered, manager])

  return { isSupported, isRegistered, sendMessage }
}`}
        </CodeSyntaxHighlighter>

        <StatusIndicator
          status={'serviceWorker' in navigator ? 'fulfilled' : 'rejected'}
        >
          Service Worker Support:{' '}
          {'serviceWorker' in navigator ? 'Available' : 'Not Available'}
        </StatusIndicator>
      </DemoSection>
    </DemoContainer>
  )
}

export default WebWorkersDemo
