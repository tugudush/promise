import { useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoSection,
  ImportantNote,
} from '@/examples/shared'

// Simulated MSW-style API responses
const simulateApiCall = async (
  endpoint: string,
  delay = 800
): Promise<unknown> => {
  await new Promise((resolve) => setTimeout(resolve, delay))

  switch (endpoint) {
    case '/api/users/123':
      return {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/avatars/john.jpg',
      }

    case '/api/users/123/posts':
      return [
        {
          id: '1',
          title: 'My First Post',
          content: 'This is my first blog post!',
          userId: '123',
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'Learning React Testing',
          content: 'Today I learned about testing async components.',
          userId: '123',
          createdAt: '2024-01-16T14:30:00Z',
        },
      ]

    case '/api/users/404':
      throw new Error('User not found')

    case '/api/network-error':
      throw new Error('Network connection failed')

    default:
      throw new Error('Unknown endpoint')
  }
}

interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface Post {
  id: string
  title: string
  content: string
  userId: string
  createdAt: string
}

// Integration component that mimics a full user profile page
function UserProfilePage({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [userLoading, setUserLoading] = useState(false)
  const [postsLoading, setPostsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = async () => {
    setError(null)
    setUser(null)
    setPosts([])

    try {
      // Load user profile
      setUserLoading(true)
      const userResponse = await simulateApiCall(`/api/users/${userId}`)
      setUser(userResponse as User)

      // Load user posts concurrently
      setPostsLoading(true)
      setUserLoading(false)

      const postsResponse = await simulateApiCall(`/api/users/${userId}/posts`)
      setPosts(postsResponse as Post[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setUserLoading(false)
      setPostsLoading(false)
    }
  }

  const handleRetry = () => {
    loadProfile()
  }

  if (error) {
    return (
      <div data-testid='profile-error'>
        <h3 style={{ color: 'red' }}>Failed to load user profile</h3>
        <p>Error: {error}</p>
        <DemoButton onClick={handleRetry} data-testid='retry-profile'>
          Retry
        </DemoButton>
      </div>
    )
  }

  return (
    <div data-testid='user-profile-page' style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <DemoButton onClick={loadProfile}>Load Profile</DemoButton>
      </div>

      {userLoading && (
        <div data-testid='loading-user-profile'>Loading user profile...</div>
      )}

      {user && !userLoading && (
        <div data-testid='user-profile-loaded'>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                marginRight: '1rem',
              }}
            >
              {user.name.charAt(0)}
            </div>
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <small>User ID: {user.id}</small>
            </div>
          </div>
        </div>
      )}

      {postsLoading && (
        <div data-testid='loading-posts'>Loading user posts...</div>
      )}

      {posts.length > 0 && !postsLoading && (
        <div data-testid='posts-loaded'>
          <h4>Recent Posts</h4>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                data-testid={`post-${post.id}`}
                style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              >
                <h5>{post.title}</h5>
                <p>{post.content}</p>
                <small style={{ color: '#6b7280' }}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}

      {user && !userLoading && !postsLoading && posts.length === 0 && (
        <div data-testid='no-posts-message'>
          <p>No posts found for this user.</p>
        </div>
      )}
    </div>
  )
}

function AsyncFlowTestingDemo() {
  const [selectedUserId, setSelectedUserId] = useState('123')

  return (
    <DemoContainer>
      <DemoSection>
        <h4>Integration Testing Demo</h4>
        <p>
          This component demonstrates a complete user profile flow that would be
          tested with Mock Service Worker (MSW) for realistic API mocking.
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            Test Scenario:{' '}
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            >
              <option value='123'>Valid User (Success Flow)</option>
              <option value='404'>User Not Found (Error)</option>
              <option value='network-error'>Network Error</option>
            </select>
          </label>
        </div>

        <UserProfilePage userId={selectedUserId} />
      </DemoSection>

      <DemoSection>
        <h4>Mock Service Worker Setup</h4>
        <CodeSyntaxHighlighter language='typescript'>
          {`// MSW setup for integration testing

// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Successful user profile fetch
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params
    
    if (id === '404') {
      return new HttpResponse(null, { 
        status: 404, 
        statusText: 'User not found' 
      })
    }

    return HttpResponse.json({
      id,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/avatars/john.jpg'
    })
  }),

  // User posts fetch
  http.get('/api/users/:id/posts', ({ params }) => {
    const { id } = params
    
    return HttpResponse.json([
      {
        id: '1',
        title: 'My First Post',
        content: 'This is my first blog post!',
        userId: id,
        createdAt: '2024-01-15T10:00:00Z'
      }
    ])
  })
]

// src/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// test-setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './src/mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())`}
        </CodeSyntaxHighlighter>
      </DemoSection>

      <DemoSection>
        <h4>Integration Test Examples</h4>
        <CodeSyntaxHighlighter language='typescript'>
          {`// Integration tests for UserProfilePage

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

describe('UserProfilePage Integration Tests', () => {
  it('loads complete user profile with posts', async () => {
    render(<UserProfilePage userId="123" />)
    
    // Start the loading process
    fireEvent.click(screen.getByText('Load Profile'))
    
    // Verify initial loading state
    expect(screen.getByTestId('loading-user-profile')).toBeInTheDocument()
    
    // Wait for user profile to load
    await screen.findByTestId('user-profile-loaded')
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    
    // Verify posts loading state appears
    expect(screen.getByTestId('loading-posts')).toBeInTheDocument()
    
    // Wait for posts to load
    await screen.findByTestId('posts-loaded')
    expect(screen.getByText('Recent Posts')).toBeInTheDocument()
    expect(screen.getByTestId('post-1')).toBeInTheDocument()
    expect(screen.getByText('My First Post')).toBeInTheDocument()
    
    // Verify loading states are removed
    expect(screen.queryByTestId('loading-user-profile')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading-posts')).not.toBeInTheDocument()
  })

  it('handles user not found error', async () => {
    // Override the handler for this specific test
    server.use(
      http.get('/api/users/404', () => {
        return new HttpResponse(null, { 
          status: 404, 
          statusText: 'User not found' 
        })
      })
    )

    render(<UserProfilePage userId="404" />)
    
    fireEvent.click(screen.getByText('Load Profile'))
    
    // Wait for error state
    await screen.findByTestId('profile-error')
    expect(screen.getByText('Failed to load user profile')).toBeInTheDocument()
    expect(screen.getByText(/User not found/)).toBeInTheDocument()
    expect(screen.getByTestId('retry-profile')).toBeInTheDocument()
  })

  it('handles network errors with retry functionality', async () => {
    // First request fails
    server.use(
      http.get('/api/users/123', () => {
        return HttpResponse.error()
      })
    )

    render(<UserProfilePage userId="123" />)
    
    fireEvent.click(screen.getByText('Load Profile'))
    
    // Wait for error
    await screen.findByTestId('profile-error')
    
    // Reset handlers to successful response
    server.resetHandlers()
    
    // Retry should now succeed
    fireEvent.click(screen.getByTestId('retry-profile'))
    
    await screen.findByTestId('user-profile-loaded')
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('handles sequential loading correctly', async () => {
    render(<UserProfilePage userId="123" />)
    
    fireEvent.click(screen.getByText('Load Profile'))
    
    // Step 1: User profile loading
    expect(screen.getByTestId('loading-user-profile')).toBeInTheDocument()
    
    // Step 2: User profile loaded, posts loading starts
    await screen.findByTestId('user-profile-loaded')
    expect(screen.getByTestId('loading-posts')).toBeInTheDocument()
    
    // Step 3: Posts loaded
    await screen.findByTestId('posts-loaded')
    expect(screen.queryByTestId('loading-posts')).not.toBeInTheDocument()
  })

  it('handles user with no posts', async () => {
    server.use(
      http.get('/api/users/123/posts', () => {
        return HttpResponse.json([])
      })
    )

    render(<UserProfilePage userId="123" />)
    
    fireEvent.click(screen.getByText('Load Profile'))
    
    // Wait for user to load
    await screen.findByTestId('user-profile-loaded')
    
    // Should show no posts message instead of posts list
    await screen.findByTestId('no-posts-message')
    expect(screen.getByText('No posts found for this user.')).toBeInTheDocument()
    expect(screen.queryByTestId('posts-loaded')).not.toBeInTheDocument()
  })
})`}
        </CodeSyntaxHighlighter>
      </DemoSection>

      <ImportantNote>
        <h4>Integration Testing Best Practices</h4>
        <ul>
          <li>
            <strong>Mock at the network level:</strong> Use MSW to intercept
            HTTP requests
          </li>
          <li>
            <strong>Test complete user flows:</strong> From initial loading to
            final data display
          </li>
          <li>
            <strong>Test error scenarios:</strong> Network errors, 404s, and API
            failures
          </li>
          <li>
            <strong>Test retry mechanisms:</strong> Ensure recovery from errors
            works
          </li>
          <li>
            <strong>Verify sequential operations:</strong> Test that dependent
            operations work correctly
          </li>
          <li>
            <strong>Use realistic data:</strong> Mock responses should match
            real API structure
          </li>
        </ul>
      </ImportantNote>
    </DemoContainer>
  )
}

export default AsyncFlowTestingDemo
