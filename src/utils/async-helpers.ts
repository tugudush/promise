/**
 * Async Helper Utilities for Promise Tutorial
 * Educational utilities to demonstrate asynchronous programming patterns
 */

export interface StepResult {
  stepNumber: number
  name: string
  result: unknown
  duration: number
}

export interface MeasuredResult<T> {
  result: T
  duration: number
}

/**
 * Simulates an API call with configurable delay
 * Educational purpose: Helps students understand async timing and Promise lifecycle
 *
 * @param delay - Milliseconds to wait before resolving
 * @param data - Data to return when resolved
 * @returns Promise that resolves with the provided data after the delay
 */
export const simulateApiCall = <T = string>(
  delay: number = 1000,
  data: T = 'API call completed successfully' as T
): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, delay)
  })
}

/**
 * Simulates API call that randomly fails
 * Educational purpose: Demonstrates error handling patterns and Promise rejection
 *
 * @param successRate - Probability of success (0-1)
 * @param delay - Milliseconds to wait before resolving/rejecting
 * @returns Promise that randomly succeeds or fails
 */
export const simulateUnreliableApiCall = (
  successRate: number = 0.7,
  delay: number = 1000
): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < successRate) {
        resolve('Data loaded successfully!')
      } else {
        reject(new Error('Simulated API failure - network timeout'))
      }
    }, delay)
  })
}

/**
 * Creates a step-by-step Promise example with detailed tracking
 * Educational purpose: Shows Promise lifecycle and state transitions
 *
 * @param steps - Array of operations to perform in sequence
 * @returns Promise that completes all steps
 */
export const createStepByStepExample = (
  steps: Array<{ name: string; duration: number; operation?: () => unknown }>
): Promise<StepResult[]> => {
  return Promise.resolve().then(async () => {
    const results: StepResult[] = []

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      const startTime = performance.now()

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, step.duration))

      // Execute optional operation
      const result = step.operation
        ? step.operation()
        : `Step ${i + 1} completed`
      const duration = performance.now() - startTime

      results.push({
        stepNumber: i + 1,
        name: step.name,
        result,
        duration,
      })
    }

    return results
  })
}

/**
 * Demonstrates Promise chaining vs nested callbacks
 * Educational purpose: Shows the evolution from callback hell to Promise chains
 */
export const callbackHellExample = (
  callback: (error: Error | null, result?: string) => void
): void => {
  setTimeout(() => {
    setTimeout(() => {
      setTimeout(() => {
        callback(null, 'All data loaded (but with callback hell!)')
      }, 300)
    }, 300)
  }, 300)
}

/**
 * Same operation using Promise chains
 * Educational purpose: Shows how Promises solve callback hell
 */
export const promiseChainExample = (): Promise<string> => {
  return simulateApiCall(300, 'User data loaded')
    .then(() => {
      return simulateApiCall(300, 'User preferences loaded')
    })
    .then(() => {
      return simulateApiCall(300, 'User profile loaded')
    })
    .then(() => {
      return 'All data loaded with clean Promise chains!'
    })
}

/**
 * Demonstrates different Promise creation patterns
 * Educational purpose: Shows various ways to create and work with Promises
 */
export const promiseCreationExamples = {
  // Immediately resolved Promise factory
  immediate: () => Promise.resolve('This resolves immediately'),

  // Immediately rejected Promise factory (no promise created until called)
  immediateError: () => Promise.reject(new Error('This rejects immediately')),

  // Delayed Promise factory
  delayed: () =>
    new Promise<string>((resolve) => {
      setTimeout(() => resolve('This resolves after 1 second'), 1000)
    }),

  // Promise with manual control
  manual: () => {
    let resolveFunction: (value: string) => void
    let rejectFunction: (error: Error) => void

    const promise = new Promise<string>((resolve, reject) => {
      resolveFunction = resolve
      rejectFunction = reject
    })

    return {
      promise,
      resolve: (value: string) => resolveFunction(value),
      reject: (error: Error) => rejectFunction(error),
    }
  },
}

/**
 * Utility to measure Promise execution time
 * Educational purpose: Shows how to measure async operation performance
 */
export const measureAsyncOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string = 'Async operation'
): Promise<MeasuredResult<T>> => {
  const startTime = performance.now()

  try {
    const result = await operation()
    const duration = performance.now() - startTime

    return { result, duration }
  } catch (error) {
    const duration = performance.now() - startTime
    throw new Error(
      `${operationName} failed after ${Math.round(duration)}ms: ${error}`
    )
  }
}
