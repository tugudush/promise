import {
  ImportantNote,
  LearningObjective,
  SuccessNote,
  TutorialContent,
} from '@/examples/shared'

import CustomPromisePatternsDemo from './CustomPromisePatternsDemo'
import PerformanceOptimizationDemo from './PerformanceOptimizationDemo'
import PromiseAllDemo from './PromiseAllDemo'
import PromiseAllSettledDemo from './PromiseAllSettledDemo'
import PromiseAnyDemo from './PromiseAnyDemo'
import PromiseRaceDemo from './PromiseRaceDemo'
import PromiseUtilitiesOverview from './PromiseUtilitiesOverview'

/**
 * Chapter 5: Advanced Promise Patterns
 * Complete tutorial content covering Promise utilities, custom patterns, and performance optimization
 */
function Chapter05Content() {
  return (
    <TutorialContent>
      <h1>Advanced Promise Patterns</h1>

      <LearningObjective>
        By the end of this chapter, you will understand:
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li key='promise-utilities'>
            How to use Promise utilities (Promise.all, Promise.allSettled,
            Promise.race, Promise.any)
          </li>
          <li key='choosing-utilities'>
            When to choose each Promise utility for different scenarios
          </li>
          <li key='custom-patterns'>
            How to create custom Promise patterns and utilities
          </li>
          <li key='promisifying-callbacks'>
            Techniques for promisifying callback-based APIs
          </li>
          <li key='performance-optimization'>
            Performance optimization strategies for async operations
          </li>
          <li key='cancellation-cleanup'>
            How to implement cancellation and cleanup in React
          </li>
        </ul>
      </LearningObjective>

      <h2>5.1 Promise Utilities</h2>

      <p>
        JavaScript provides several built-in Promise utilities that help manage
        multiple asynchronous operations efficiently. These utilities are
        essential for building scalable React applications that handle complex
        async workflows.
      </p>

      <ImportantNote>
        Understanding when to use each Promise utility is crucial for building
        efficient React applications. Each utility serves different use cases
        and performance characteristics.
      </ImportantNote>

      <PromiseUtilitiesOverview />
      <PromiseAllDemo />
      <PromiseAllSettledDemo />
      <PromiseRaceDemo />
      <PromiseAnyDemo />

      <h2>5.2 Custom Promise Patterns</h2>

      <p>
        Learn to create reusable Promise utilities and patterns that can be
        applied across your React applications. We'll explore how to build
        custom async helpers and promisify callback-based APIs.
      </p>

      <SuccessNote>
        Creating reusable async utilities helps maintain consistency across your
        application and makes complex async operations more manageable and
        testable.
      </SuccessNote>

      <CustomPromisePatternsDemo />

      <h2>5.3 Performance Optimization</h2>

      <p>
        Discover advanced techniques for optimizing async operations in React,
        including cancellation patterns, memoization strategies, and efficient
        data loading patterns.
      </p>

      <PerformanceOptimizationDemo />
    </TutorialContent>
  )
}

export default Chapter05Content
