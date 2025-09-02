import { useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoSection,
  ImportantNote,
} from '@/examples/shared'

// Simulated async data fetching function
const fetchMultipleData = async (): Promise<{
  users: string[]
  posts: string[]
  comments: string[]
}> => {
  // Simulate different loading times for each resource
  const [users, posts, comments] = await Promise.all([
    new Promise<string[]>((resolve) =>
      setTimeout(() => resolve(['Alice', 'Bob', 'Charlie']), 800)
    ),
    new Promise<string[]>((resolve) =>
      setTimeout(() => resolve(['Post 1', 'Post 2', 'Post 3']), 1200)
    ),
    new Promise<string[]>((resolve) =>
      setTimeout(() => resolve(['Comment A', 'Comment B', 'Comment C']), 600)
    ),
  ])

  return { users, posts, comments }
}

// Component demonstrating concurrent loading
function MultiDataLoader() {
  const [data, setData] = useState<{
    users: string[]
    posts: string[]
    comments: string[]
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAllData = async () => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const result = await fetchMultipleData()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}
    >
      <h4>Multi-Data Loader Component</h4>
      <DemoButton onClick={loadAllData} disabled={loading}>
        {loading ? 'Loading All Data...' : 'Load All Data'}
      </DemoButton>

      {loading && (
        <div data-testid='loading-all'>
          Loading users, posts, and comments concurrently...
        </div>
      )}

      {error && (
        <div data-testid='error' style={{ color: 'red' }}>
          Error: {error}
        </div>
      )}

      {data && (
        <div data-testid='all-data-loaded'>
          <div data-testid='users-section'>
            <h5>Users Loaded:</h5>
            <ul>
              {data.users.map((user) => (
                <li key={user} data-testid={`user-${user.toLowerCase()}`}>
                  {user}
                </li>
              ))}
            </ul>
          </div>

          <div data-testid='posts-section'>
            <h5>Posts Loaded:</h5>
            <ul>
              {data.posts.map((post) => (
                <li
                  key={post}
                  data-testid={`post-${post.replace(' ', '-').toLowerCase()}`}
                >
                  {post}
                </li>
              ))}
            </ul>
          </div>

          <div data-testid='comments-section'>
            <h5>Comments Loaded:</h5>
            <ul>
              {data.comments.map((comment) => (
                <li
                  key={comment}
                  data-testid={`comment-${comment.replace(' ', '-').toLowerCase()}`}
                >
                  {comment}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

// Sequential loading component
function SequentialLoader() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState<string[]>([])

  const startProcess = async () => {
    setLoading(true)
    setStep(0)
    setCompleted([])

    try {
      // Step 1
      setStep(1)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setCompleted((prev) => [...prev, 'Step 1 Complete'])

      // Step 2
      setStep(2)
      await new Promise((resolve) => setTimeout(resolve, 600))
      setCompleted((prev) => [...prev, 'Step 2 Complete'])

      // Step 3
      setStep(3)
      await new Promise((resolve) => setTimeout(resolve, 400))
      setCompleted((prev) => [...prev, 'Step 3 Complete'])

      // All done
      setStep(0)
    } catch {
      // In real app, would handle error appropriately
      setStep(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}
    >
      <h4>Sequential Process Component</h4>
      <DemoButton onClick={startProcess} disabled={loading}>
        {loading ? 'Processing...' : 'Start Sequential Process'}
      </DemoButton>

      {loading && step > 0 && (
        <div data-testid='current-step'>Currently processing: Step {step}</div>
      )}

      <div data-testid='completed-steps'>
        {completed.map((item, index) => (
          <div key={index} data-testid={`completed-${index + 1}`}>
            ✓ {item}
          </div>
        ))}
      </div>

      {!loading && completed.length === 3 && (
        <div data-testid='all-steps-complete'>🎉 All Steps Complete</div>
      )}
    </div>
  )
}

function TestingLibraryUtilitiesDemo() {
  return (
    <DemoContainer>
      <DemoSection>
        <h4>Interactive Demo: React Testing Library Utilities</h4>
        <p>
          These components demonstrate different async patterns that require
          specific React Testing Library utilities for proper testing.
        </p>

        <div style={{ marginBottom: '2rem' }}>
          <h5>Concurrent Loading (use Promise.all in tests)</h5>
          <MultiDataLoader />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h5>Sequential Loading (use findBy queries for each step)</h5>
          <SequentialLoader />
        </div>
      </DemoSection>

      <DemoSection>
        <h4>Testing Patterns for These Components</h4>
        <CodeSyntaxHighlighter language='typescript'>
          {`// Testing concurrent loading with Promise.all

import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

describe('MultiDataLoader', () => {
  beforeEach(() => {
    vi.mocked(fetchMultipleData).mockResolvedValue({
      users: ['Alice', 'Bob'],
      posts: ['Post 1', 'Post 2'],
      comments: ['Comment A', 'Comment B']
    })
  })

  it('loads all data concurrently', async () => {
    render(<MultiDataLoader />)
    
    fireEvent.click(screen.getByText('Load All Data'))
    
    // Verify loading state
    expect(screen.getByTestId('loading-all')).toBeInTheDocument()
    
    // Wait for all data to load using Promise.all approach
    const [usersSection, postsSection, commentsSection] = await Promise.all([
      screen.findByTestId('users-section'),
      screen.findByTestId('posts-section'),
      screen.findByTestId('comments-section')
    ])
    
    expect(usersSection).toBeInTheDocument()
    expect(postsSection).toBeInTheDocument()
    expect(commentsSection).toBeInTheDocument()
    
    // Verify specific data items
    expect(screen.getByTestId('user-alice')).toBeInTheDocument()
    expect(screen.getByTestId('post-post-1')).toBeInTheDocument()
    expect(screen.getByTestId('comment-comment-a')).toBeInTheDocument()
  })
})

// Testing sequential operations

describe('SequentialLoader', () => {
  it('processes steps in sequence', async () => {
    render(<SequentialLoader />)
    
    fireEvent.click(screen.getByText('Start Sequential Process'))
    
    // Step 1 completion
    await screen.findByTestId('completed-1')
    expect(screen.getByText('✓ Step 1 Complete')).toBeInTheDocument()
    
    // Step 2 completion
    await screen.findByTestId('completed-2')
    expect(screen.getByText('✓ Step 2 Complete')).toBeInTheDocument()
    
    // Step 3 completion
    await screen.findByTestId('completed-3')
    expect(screen.getByText('✓ Step 3 Complete')).toBeInTheDocument()
    
    // Final completion
    await screen.findByTestId('all-steps-complete')
    expect(screen.getByText('🎉 All Steps Complete')).toBeInTheDocument()
  })

  it('shows current step during processing', async () => {
    render(<SequentialLoader />)
    
    fireEvent.click(screen.getByText('Start Sequential Process'))
    
    // Should show current step during processing
    expect(screen.getByTestId('current-step')).toHaveTextContent('Step 1')
    
    // Wait for first step to complete, then check step 2
    await screen.findByTestId('completed-1')
    expect(screen.getByTestId('current-step')).toHaveTextContent('Step 2')
  })
})

// Advanced utility patterns

describe('Advanced Testing Patterns', () => {
  it('uses waitForElementToBeRemoved for loading states', async () => {
    render(<MultiDataLoader />)
    
    fireEvent.click(screen.getByText('Load All Data'))
    
    // Verify loading appears
    const loadingElement = screen.getByTestId('loading-all')
    expect(loadingElement).toBeInTheDocument()
    
    // Wait for loading to be removed
    await waitForElementToBeRemoved(loadingElement)
    
    // Now verify data is loaded
    expect(screen.getByTestId('all-data-loaded')).toBeInTheDocument()
  })

  it('uses custom timeout for slow operations', async () => {
    render(<MultiDataLoader />)
    
    fireEvent.click(screen.getByText('Load All Data'))
    
    // Wait longer for slow operations
    await screen.findByTestId('all-data-loaded', {}, { timeout: 5000 })
  })

  it('tests multiple assertions with waitFor', async () => {
    render(<SequentialLoader />)
    
    fireEvent.click(screen.getByText('Start Sequential Process'))
    
    // Wait for multiple conditions to be true
    await waitFor(() => {
      expect(screen.getByTestId('completed-1')).toBeInTheDocument()
      expect(screen.getByTestId('completed-2')).toBeInTheDocument()
      expect(screen.getByTestId('completed-3')).toBeInTheDocument()
    })
  })
}`}
        </CodeSyntaxHighlighter>
      </DemoSection>

      <ImportantNote>
        <h4>Key React Testing Library Utilities</h4>
        <ul>
          <li>
            <strong>findBy queries:</strong> Automatically wait for elements to
            appear (combines getBy + waitFor)
          </li>
          <li>
            <strong>waitFor:</strong> Wait for arbitrary conditions to be true
          </li>
          <li>
            <strong>waitForElementToBeRemoved:</strong> Wait for elements to
            disappear
          </li>
          <li>
            <strong>Promise.all:</strong> Test concurrent operations that
            complete together
          </li>
          <li>
            <strong>Custom timeouts:</strong> Adjust waiting time for slow
            operations
          </li>
        </ul>
      </ImportantNote>
    </DemoContainer>
  )
}

export default TestingLibraryUtilitiesDemo
