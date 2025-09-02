import { useEffect, useState } from 'react'

import {
  CodeSyntaxHighlighter,
  LearningObjective,
  TutorialContent,
} from '@/examples/shared'

import AsyncComponentTestingDemo from './AsyncComponentTestingDemo'
import AsyncFlowTestingDemo from './AsyncFlowTestingDemo'
import MockingAsyncFunctionsDemo from './MockingAsyncFunctionsDemo'
import TestingLibraryUtilitiesDemo from './TestingLibraryUtilitiesDemo'

function Chapter09Content() {
  const [showDemo, setShowDemo] = useState(false)

  useEffect(() => {
    // Small delay to demonstrate progressive loading
    const timer = setTimeout(() => setShowDemo(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <TutorialContent>
      <h1>Chapter 9: Testing Async Code in React</h1>

      <LearningObjective>
        Learn how to effectively test asynchronous operations in React
        components, including mocking async functions, testing loading and error
        states, and writing integration tests that verify complete async flows.
      </LearningObjective>

      <h2>9.1 Testing Components with Async Operations</h2>
      <p>
        Testing asynchronous code in React requires special attention to timing,
        state changes, and error scenarios. React Testing Library provides
        excellent utilities for testing async operations in a way that closely
        matches how users interact with your application.
      </p>

      <h3>Key Testing Patterns for Async React Code</h3>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Essential testing patterns for async React components

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Pattern 1: Testing loading states
it('shows loading state while data is being fetched', async () => {
  render(<UserProfile userId="123" />)
  
  // Check loading state appears immediately
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  
  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
})

// Pattern 2: Testing successful data loading
it('displays user data after successful fetch', async () => {
  // Mock the API response
  const mockUser = { id: '123', name: 'John Doe', email: 'john@example.com' }
  vi.mocked(fetchUser).mockResolvedValue(mockUser)
  
  render(<UserProfile userId="123" />)
  
  // Wait for user data to appear
  await screen.findByText('John Doe')
  expect(screen.getByText('john@example.com')).toBeInTheDocument()
})

// Pattern 3: Testing error states
it('displays error message when fetch fails', async () => {
  // Mock API to reject
  vi.mocked(fetchUser).mockRejectedValue(new Error('User not found'))
  
  render(<UserProfile userId="123" />)
  
  // Wait for error message to appear
  await screen.findByText(/error.*user not found/i)
})

// Pattern 4: Testing user interactions that trigger async operations
it('refetches data when retry button is clicked', async () => {
  const user = userEvent.setup()
  
  // Start with error state
  vi.mocked(fetchUser).mockRejectedValueOnce(new Error('Network error'))
  
  render(<UserProfile userId="123" />)
  
  // Wait for error and retry button
  await screen.findByText(/network error/i)
  const retryButton = screen.getByRole('button', { name: /retry/i })
  
  // Mock successful retry
  const mockUser = { id: '123', name: 'John Doe' }
  vi.mocked(fetchUser).mockResolvedValue(mockUser)
  
  // Click retry and verify success
  await user.click(retryButton)
  await screen.findByText('John Doe')
})`}
      </CodeSyntaxHighlighter>

      {showDemo && (
        <div>
          <h4>Demo: Mocking Async Functions</h4>
          <MockingAsyncFunctionsDemo />
        </div>
      )}

      <h2>9.2 React Testing Library Async Utilities</h2>
      <p>
        React Testing Library provides several utilities specifically designed
        for testing asynchronous behavior. Understanding when and how to use
        each utility is crucial for writing reliable tests.
      </p>

      <CodeSyntaxHighlighter language='typescript'>
        {`// React Testing Library async utilities comparison

// 1. findBy queries - Best for testing elements that appear after async operations
const userElement = await screen.findByText('John Doe') // Waits up to 1000ms by default
const customTimeout = await screen.findByText('John Doe', {}, { timeout: 3000 })

// 2. waitFor - Best for waiting for state changes or assertions
await waitFor(() => {
  expect(screen.getByText('John Doe')).toBeInTheDocument()
})

// 3. waitForElementToBeRemoved - Best for waiting for elements to disappear
await waitForElementToBeRemoved(screen.getByText(/loading/i))

// 4. act - Rarely needed with modern React Testing Library, but useful for imperative updates
import { act } from '@testing-library/react'
await act(async () => {
  fireEvent.click(screen.getByText('Load More'))
})

// Advanced patterns for complex async scenarios

// Testing multiple async operations in sequence
it('handles sequential async operations', async () => {
  render(<MultiStepProcess />)
  
  // Step 1: Initial load
  await screen.findByText('Step 1 Complete')
  
  // Step 2: User interaction triggers next async operation
  const nextButton = screen.getByRole('button', { name: /next/i })
  fireEvent.click(nextButton)
  
  await screen.findByText('Step 2 Complete')
  
  // Step 3: Final verification
  expect(screen.getByText('All Steps Complete')).toBeInTheDocument()
})

// Testing concurrent async operations
it('handles concurrent data loading', async () => {
  render(<DashboardWithMultipleAPIs />)
  
  // All these operations happen concurrently
  const [users, posts, comments] = await Promise.all([
    screen.findByText(/users loaded/i),
    screen.findByText(/posts loaded/i),
    screen.findByText(/comments loaded/i)
  ])
  
  expect(users).toBeInTheDocument()
  expect(posts).toBeInTheDocument()
  expect(comments).toBeInTheDocument()
})`}
      </CodeSyntaxHighlighter>

      {showDemo && (
        <div>
          <h4>Demo: Testing Library Utilities</h4>
          <TestingLibraryUtilitiesDemo />
        </div>
      )}

      <h2>9.3 Testing Complete Async Components</h2>
      <p>
        Real-world React components often combine multiple async operations,
        loading states, error handling, and user interactions. Testing these
        components requires comprehensive test suites that cover all scenarios.
      </p>

      {showDemo && (
        <div>
          <h4>Demo: Complete Async Component Testing</h4>
          <AsyncComponentTestingDemo />
        </div>
      )}

      <h2>9.4 Integration Testing with Mock Service Worker</h2>
      <p>
        Integration tests verify that multiple components work together
        correctly. Mock Service Worker (MSW) allows you to intercept and mock
        API calls at the network level, providing more realistic testing
        scenarios.
      </p>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Setting up Mock Service Worker for integration testing

import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { beforeAll, afterEach, afterAll } from 'vitest'

// Define API handlers
const handlers = [
  // Mock successful user fetch
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      id,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/avatars/john.jpg'
    })
  }),

  // Mock user posts fetch
  http.get('/api/users/:id/posts', ({ params }) => {
    const { id } = params
    return HttpResponse.json([
      {
        id: '1',
        title: 'First Post',
        content: 'This is my first post',
        userId: id,
        createdAt: '2024-01-01T10:00:00Z'
      }
    ])
  }),

  // Mock error scenario
  http.get('/api/users/404', () => {
    return new HttpResponse(null, { 
      status: 404, 
      statusText: 'User not found' 
    })
  })
]

// Setup MSW server
const server = setupServer(...handlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Clean up after each test
afterEach(() => server.resetHandlers())

// Close server after all tests
afterAll(() => server.close())

// Integration test example
describe('UserProfilePage Integration', () => {
  it('loads user profile and posts successfully', async () => {
    render(
      <Router>
        <UserProfilePage />
      </Router>,
      { initialEntries: ['/users/123'] }
    )

    // Verify loading states
    expect(screen.getByText(/loading user profile/i)).toBeInTheDocument()

    // Wait for user data to load
    await screen.findByText('John Doe')
    expect(screen.getByText('john@example.com')).toBeInTheDocument()

    // Verify posts section loads
    await screen.findByText('First Post')
    expect(screen.getByText('This is my first post')).toBeInTheDocument()

    // Verify loading states are removed
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

  it('handles network errors gracefully', async () => {
    // Override handler to simulate network error
    server.use(
      http.get('/api/users/123', () => {
        return HttpResponse.error()
      })
    )

    render(
      <Router>
        <UserProfilePage />
      </Router>,
      { initialEntries: ['/users/123'] }
    )

    // Wait for error message
    await screen.findByText(/failed to load user profile/i)
    
    // Verify retry button is available
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })
})`}
      </CodeSyntaxHighlighter>

      {showDemo && (
        <div>
          <h4>Demo: Integration Testing Flow</h4>
          <AsyncFlowTestingDemo />
        </div>
      )}

      <h2>Chapter Summary</h2>
      <p>
        Testing asynchronous code in React requires understanding the timing of
        state changes, proper mocking strategies, and comprehensive coverage of
        success, loading, and error states. Key takeaways:
      </p>
      <ul>
        <li>
          Use React Testing Library's async utilities (<code>findBy</code>,{' '}
          <code>waitFor</code>) instead of arbitrary timeouts
        </li>
        <li>
          Mock async functions at the appropriate level - unit tests mock
          functions, integration tests mock network requests
        </li>
        <li>
          Always test loading states, success states, and error states for
          complete coverage
        </li>
        <li>Write tests that match how users interact with your application</li>
        <li>
          Use Mock Service Worker for realistic integration testing scenarios
        </li>
      </ul>
    </TutorialContent>
  )
}

export default Chapter09Content
