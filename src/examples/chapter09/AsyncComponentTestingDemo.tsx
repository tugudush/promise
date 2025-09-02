import { useEffect, useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoSection,
  WarningNote,
} from '@/examples/shared'

// Types for our data
interface User {
  id: string
  name: string
  email: string
}

interface Post {
  id: string
  title: string
  content: string
  userId: string
}

// Mock API functions
const fetchUser = async (id: string): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (id === 'not-found') {
    throw new Error('User not found')
  }

  if (id === 'network-error') {
    throw new Error('Network error')
  }

  return {
    id,
    name: id === '1' ? 'Alice Johnson' : 'Bob Smith',
    email: id === '1' ? 'alice@example.com' : 'bob@example.com',
  }
}

const fetchUserPosts = async (userId: string): Promise<Post[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600))

  if (userId === 'no-posts') {
    return []
  }

  return [
    {
      id: '1',
      title: 'First Post',
      content: 'This is the first post content.',
      userId,
    },
    {
      id: '2',
      title: 'Second Post',
      content: 'This is the second post content.',
      userId,
    },
  ]
}

// Complex component that we need to test thoroughly
function UserProfileWithPosts({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingUser, setLoadingUser] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [userError, setUserError] = useState<string | null>(null)
  const [postsError, setPostsError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const loadUserData = async (showRetry = false) => {
    setLoadingUser(true)
    setUserError(null)

    if (showRetry) {
      setRetryCount((prev) => prev + 1)
    }

    try {
      const userData = await fetchUser(userId)
      setUser(userData)

      // After user loads, automatically load posts
      loadUserPosts(userId)
    } catch (err) {
      setUserError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoadingUser(false)
    }
  }

  const loadUserPosts = async (userIdToLoad: string) => {
    setLoadingPosts(true)
    setPostsError(null)

    try {
      const userPosts = await fetchUserPosts(userIdToLoad)
      setPosts(userPosts)
    } catch (err) {
      setPostsError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setLoadingPosts(false)
    }
  }

  useEffect(() => {
    if (userId) {
      loadUserData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const handleRetry = () => {
    setUser(null)
    setPosts([])
    loadUserData(true)
  }

  if (loadingUser) {
    return (
      <div data-testid='loading-user'>
        Loading user profile...
        {retryCount > 0 && ` (Attempt ${retryCount + 1})`}
      </div>
    )
  }

  if (userError) {
    return (
      <div data-testid='user-error'>
        <p style={{ color: 'red' }}>Failed to load user: {userError}</p>
        <DemoButton onClick={handleRetry} data-testid='retry-button'>
          Retry
        </DemoButton>
      </div>
    )
  }

  if (!user) {
    return <div data-testid='no-user'>No user selected</div>
  }

  return (
    <div
      data-testid='user-profile'
      style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}
    >
      <div data-testid='user-info'>
        <h4>{user.name}</h4>
        <p>{user.email}</p>
        <p>User ID: {user.id}</p>
      </div>

      <div data-testid='posts-section'>
        <h5>User Posts</h5>

        {loadingPosts && (
          <div data-testid='loading-posts'>Loading posts...</div>
        )}

        {postsError && (
          <div data-testid='posts-error' style={{ color: 'red' }}>
            Error loading posts: {postsError}
          </div>
        )}

        {!loadingPosts && !postsError && (
          <div data-testid='posts-list'>
            {posts.length === 0 ? (
              <p data-testid='no-posts'>No posts found</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  data-testid={`post-${post.id}`}
                  style={{
                    margin: '1rem 0',
                    padding: '0.5rem',
                    border: '1px solid #eee',
                    borderRadius: '4px',
                  }}
                >
                  <h6>{post.title}</h6>
                  <p>{post.content}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {retryCount > 0 && (
        <div
          data-testid='retry-count'
          style={{ fontSize: '0.9em', color: '#666' }}
        >
          Retries: {retryCount}
        </div>
      )}
    </div>
  )
}

function AsyncComponentTestingDemo() {
  const [selectedUserId, setSelectedUserId] = useState('1')

  return (
    <DemoContainer>
      <DemoSection>
        <h4>Complex Async Component Testing</h4>
        <p>
          This component demonstrates multiple async operations, error handling,
          retry logic, and sequential loading that requires comprehensive
          testing.
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            Select User ID:{' '}
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            >
              <option value='1'>User 1 (Success)</option>
              <option value='2'>User 2 (Success)</option>
              <option value='not-found'>not-found (User Error)</option>
              <option value='network-error'>
                network-error (Network Error)
              </option>
              <option value='no-posts'>no-posts (No Posts)</option>
            </select>
          </label>
        </div>

        <UserProfileWithPosts userId={selectedUserId} />
      </DemoSection>

      <DemoSection>
        <h4>Comprehensive Test Suite</h4>
        <CodeSyntaxHighlighter language='typescript'>
          {`// Complete test coverage for UserProfileWithPosts component

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock the API functions
vi.mock('./api', () => ({
  fetchUser: vi.fn(),
  fetchUserPosts: vi.fn()
}))

describe('UserProfileWithPosts', () => {
  const mockFetchUser = vi.mocked(fetchUser)
  const mockFetchUserPosts = vi.mocked(fetchUserPosts)

  beforeEach(() => {
    mockFetchUser.mockClear()
    mockFetchUserPosts.mockClear()
  })

  describe('Loading States', () => {
    it('shows loading state for user data', async () => {
      // Mock delayed response
      mockFetchUser.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            id: '1', name: 'Alice', email: 'alice@test.com'
          }), 100)
        )
      )

      render(<UserProfileWithPosts userId="1" />)

      // Should show loading immediately
      expect(screen.getByTestId('loading-user')).toBeInTheDocument()
      expect(screen.getByText('Loading user profile...')).toBeInTheDocument()

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId('loading-user')).not.toBeInTheDocument()
      })
    })

    it('shows loading state for posts after user loads', async () => {
      mockFetchUser.mockResolvedValue({
        id: '1', name: 'Alice', email: 'alice@test.com'
      })
      
      mockFetchUserPosts.mockImplementation(() =>
        new Promise(resolve => 
          setTimeout(() => resolve([]), 100)
        )
      )

      render(<UserProfileWithPosts userId="1" />)

      // Wait for user to load
      await screen.findByTestId('user-info')

      // Should show posts loading
      expect(screen.getByTestId('loading-posts')).toBeInTheDocument()

      // Wait for posts loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId('loading-posts')).not.toBeInTheDocument()
      })
    })
  })

  describe('Success States', () => {
    it('displays user information and posts', async () => {
      const mockUser = { id: '1', name: 'Alice Johnson', email: 'alice@test.com' }
      const mockPosts = [
        { id: '1', title: 'First Post', content: 'Content 1', userId: '1' },
        { id: '2', title: 'Second Post', content: 'Content 2', userId: '1' }
      ]

      mockFetchUser.mockResolvedValue(mockUser)
      mockFetchUserPosts.mockResolvedValue(mockPosts)

      render(<UserProfileWithPosts userId="1" />)

      // Wait for user data
      await screen.findByTestId('user-info')
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
      expect(screen.getByText('alice@test.com')).toBeInTheDocument()

      // Wait for posts
      await screen.findByTestId('posts-list')
      expect(screen.getByTestId('post-1')).toBeInTheDocument()
      expect(screen.getByTestId('post-2')).toBeInTheDocument()
      expect(screen.getByText('First Post')).toBeInTheDocument()
    })

    it('handles user with no posts', async () => {
      mockFetchUser.mockResolvedValue({
        id: '1', name: 'Alice', email: 'alice@test.com'
      })
      mockFetchUserPosts.mockResolvedValue([])

      render(<UserProfileWithPosts userId="1" />)

      await screen.findByTestId('user-info')
      await screen.findByTestId('no-posts')
      
      expect(screen.getByText('No posts found')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('shows error when user fetch fails', async () => {
      mockFetchUser.mockRejectedValue(new Error('User not found'))

      render(<UserProfileWithPosts userId="not-found" />)

      await screen.findByTestId('user-error')
      expect(screen.getByText(/Failed to load user: User not found/))
        .toBeInTheDocument()
      expect(screen.getByTestId('retry-button')).toBeInTheDocument()
    })

    it('shows error when posts fetch fails but user succeeds', async () => {
      mockFetchUser.mockResolvedValue({
        id: '1', name: 'Alice', email: 'alice@test.com'
      })
      mockFetchUserPosts.mockRejectedValue(new Error('Posts API error'))

      render(<UserProfileWithPosts userId="1" />)

      // User should load successfully
      await screen.findByTestId('user-info')
      expect(screen.getByText('Alice')).toBeInTheDocument()

      // But posts should show error
      await screen.findByTestId('posts-error')
      expect(screen.getByText(/Error loading posts/)).toBeInTheDocument()
    })
  })

  describe('Retry Functionality', () => {
    it('retries loading user data when retry button is clicked', async () => {
      // First attempt fails
      mockFetchUser.mockRejectedValueOnce(new Error('Network error'))
      
      // Second attempt succeeds
      mockFetchUser.mockResolvedValueOnce({
        id: '1', name: 'Alice', email: 'alice@test.com'
      })
      mockFetchUserPosts.mockResolvedValue([])

      render(<UserProfileWithPosts userId="1" />)

      // Wait for error state
      await screen.findByTestId('user-error')
      
      // Click retry
      fireEvent.click(screen.getByTestId('retry-button'))

      // Should show loading with retry count
      expect(screen.getByText(/Loading user profile... \\(Attempt 2\\)/))
        .toBeInTheDocument()

      // Wait for success
      await screen.findByTestId('user-info')
      expect(screen.getByText('Alice')).toBeInTheDocument()
      
      // Should show retry count
      expect(screen.getByTestId('retry-count')).toBeInTheDocument()
      expect(screen.getByText('Retries: 1')).toBeInTheDocument()
    })
  })

  describe('Component Integration', () => {
    it('handles user ID changes properly', async () => {
      const mockUser1 = { id: '1', name: 'Alice', email: 'alice@test.com' }
      const mockUser2 = { id: '2', name: 'Bob', email: 'bob@test.com' }
      
      mockFetchUser
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser2)
      mockFetchUserPosts.mockResolvedValue([])

      const { rerender } = render(<UserProfileWithPosts userId="1" />)

      // Wait for first user
      await screen.findByText('Alice')

      // Change userId prop
      rerender(<UserProfileWithPosts userId="2" />)

      // Should show loading for new user
      expect(screen.getByTestId('loading-user')).toBeInTheDocument()

      // Wait for second user
      await screen.findByText('Bob')
      expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    })
  })
})`}
        </CodeSyntaxHighlighter>
      </DemoSection>

      <WarningNote>
        <h4>Testing Complex Async Components</h4>
        <ul>
          <li>
            <strong>Test all states:</strong> loading, success, error, and retry
            states
          </li>
          <li>
            <strong>Test sequential operations:</strong> Verify that dependent
            async calls work correctly
          </li>
          <li>
            <strong>Test error isolation:</strong> Ensure one failed operation
            doesn't break others
          </li>
          <li>
            <strong>Test prop changes:</strong> Verify component handles
            changing props correctly
          </li>
          <li>
            <strong>Mock timing:</strong> Use proper mock implementations to
            control async timing
          </li>
        </ul>
      </WarningNote>
    </DemoContainer>
  )
}

export default AsyncComponentTestingDemo
