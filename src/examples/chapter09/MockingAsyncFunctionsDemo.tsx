import { useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoSection,
  SuccessNote,
} from '@/examples/shared'

// Mock function that we'll test
const fetchUser = async (
  id: string
): Promise<{ id: string; name: string; email: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (id === 'error') {
    throw new Error('User not found')
  }

  return {
    id,
    name: 'John Doe',
    email: 'john@example.com',
  }
}

// Component we want to test
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<{
    id: string
    name: string
    email: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUser = async () => {
    setLoading(true)
    setError(null)
    setUser(null)

    try {
      const userData = await fetchUser(userId)
      setUser(userData)
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
      <h4>User Profile Component</h4>
      <DemoButton onClick={loadUser} disabled={loading}>
        {loading ? 'Loading...' : 'Load User'}
      </DemoButton>

      {loading && <div data-testid='loading'>Loading user data...</div>}
      {error && (
        <div data-testid='error' style={{ color: 'red' }}>
          Error: {error}
        </div>
      )}
      {user && (
        <div data-testid='user-data'>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}
    </div>
  )
}

function MockingAsyncFunctionsDemo() {
  const [selectedUserId, setSelectedUserId] = useState('123')

  return (
    <DemoContainer>
      <DemoSection>
        <h4>Interactive Testing Demo</h4>
        <p>
          This component demonstrates the patterns we need to test. Try
          different scenarios:
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            User ID to fetch:{' '}
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              style={{ marginLeft: '0.5rem' }}
            >
              <option value='123'>123 (Success)</option>
              <option value='456'>456 (Success)</option>
              <option value='error'>error (Error)</option>
            </select>
          </label>
        </div>

        <UserProfile userId={selectedUserId} />
      </DemoSection>

      <DemoSection>
        <h4>Test Code for This Component</h4>
        <CodeSyntaxHighlighter language='typescript'>
          {`// Complete test suite for UserProfile component

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import UserProfile from './UserProfile'

// Mock the fetchUser function
vi.mock('./api', () => ({
  fetchUser: vi.fn()
}))

describe('UserProfile Component', () => {
  const mockFetchUser = vi.mocked(fetchUser)

  beforeEach(() => {
    // Clear mocks before each test
    mockFetchUser.mockClear()
  })

  it('shows loading state when fetching user', async () => {
    // Mock a delayed response
    mockFetchUser.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        id: '123', name: 'John', email: 'john@example.com'
      }), 100))
    )

    render(<UserProfile userId="123" />)
    
    // Click load button
    fireEvent.click(screen.getByText('Load User'))
    
    // Verify loading state appears
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })
  })

  it('displays user data on successful fetch', async () => {
    const mockUser = { id: '123', name: 'John Doe', email: 'john@example.com' }
    mockFetchUser.mockResolvedValue(mockUser)

    render(<UserProfile userId="123" />)
    
    fireEvent.click(screen.getByText('Load User'))
    
    // Wait for user data to appear
    await screen.findByTestId('user-data')
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(mockFetchUser).toHaveBeenCalledWith('123')
  })

  it('displays error message on fetch failure', async () => {
    const errorMessage = 'User not found'
    mockFetchUser.mockRejectedValue(new Error(errorMessage))

    render(<UserProfile userId="error" />)
    
    fireEvent.click(screen.getByText('Load User'))
    
    // Wait for error to appear
    await screen.findByTestId('error')
    
    expect(screen.getByText(\`Error: \${errorMessage}\`)).toBeInTheDocument()
    expect(screen.queryByTestId('user-data')).not.toBeInTheDocument()
  })

  it('clears previous data when loading new user', async () => {
    // First successful load
    mockFetchUser.mockResolvedValueOnce({ 
      id: '123', name: 'John', email: 'john@example.com' 
    })

    const { rerender } = render(<UserProfile userId="123" />)
    fireEvent.click(screen.getByText('Load User'))
    await screen.findByText('John')

    // Second load with error
    mockFetchUser.mockRejectedValueOnce(new Error('Network error'))
    
    rerender(<UserProfile userId="456" />)
    fireEvent.click(screen.getByText('Load User'))
    
    // Verify previous data is cleared during loading
    expect(screen.queryByText('John')).not.toBeInTheDocument()
    await screen.findByText('Error: Network error')
  })
})`}
        </CodeSyntaxHighlighter>
      </DemoSection>

      <SuccessNote>
        <h4>Key Testing Patterns Demonstrated</h4>
        <ul>
          <li>
            <strong>Mock Setup:</strong> Use <code>vi.mock()</code> to mock
            async functions
          </li>
          <li>
            <strong>Loading States:</strong> Test that loading indicators appear
            and disappear
          </li>
          <li>
            <strong>Success Scenarios:</strong> Verify data is displayed
            correctly after async operations
          </li>
          <li>
            <strong>Error Scenarios:</strong> Test error handling and error
            message display
          </li>
          <li>
            <strong>State Management:</strong> Ensure previous state is cleared
            appropriately
          </li>
        </ul>
      </SuccessNote>
    </DemoContainer>
  )
}

export default MockingAsyncFunctionsDemo
