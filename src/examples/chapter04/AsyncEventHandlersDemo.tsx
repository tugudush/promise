import { useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoOutput,
  DemoSection,
} from '@/examples/shared'
import { simulateApiCall } from '@/utils/async-helpers'

interface User {
  id: number
  name: string
  email: string
  status: string
}

/**
 * Interactive demo showing async event handlers in React
 * Educational purpose: Demonstrate async functions in event handlers
 */
function AsyncEventHandlersDemo() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [submitResult, setSubmitResult] = useState<string>('')

  // Simulate user data
  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
  }

  // Async event handler for loading user data
  const handleLoadUser = async () => {
    setLoading(true)
    setError('')

    try {
      // Simulate API call to load user data
      await simulateApiCall(1200)
      setUser(mockUser)
    } catch {
      setError('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  // Async event handler for form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitResult('')
    setLoading(true)

    try {
      // Simulate form submission with validation
      if (!formData.name.trim() || !formData.email.trim()) {
        throw new Error('Name and email are required')
      }

      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address')
      }

      // Simulate API call for form submission
      await simulateApiCall(1500)

      setSubmitResult(`✅ Profile updated successfully!
Name: ${formData.name}
Email: ${formData.email}`)

      // Reset form after successful submission
      setFormData({ name: '', email: '' })
    } catch (err) {
      setSubmitResult(
        `❌ ${err instanceof Error ? err.message : 'Submission failed'}`
      )
    } finally {
      setLoading(false)
    }
  }

  // Async event handler with debouncing simulation
  const handleRefresh = async () => {
    setLoading(true)
    setError('')

    try {
      // Simulate refresh operation
      await simulateApiCall(800)

      // Update user with "refreshed" timestamp
      const refreshedUser = {
        ...mockUser,
        status: `refreshed at ${new Date().toLocaleTimeString()}`,
      }
      setUser(refreshedUser)
    } catch {
      setError('Failed to refresh user data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DemoSection>
      <h3>🎯 Async Event Handlers in React</h3>
      <p>
        This demo shows how to use async functions in different types of React
        event handlers:
      </p>

      {/* Load User Demo */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '8px',
        }}
      >
        <h4>1. Async Button Click Handler</h4>
        <DemoButton onClick={handleLoadUser} disabled={loading}>
          {loading ? 'Loading User...' : 'Load User Data'}
        </DemoButton>

        {user && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#dcfce7',
              borderRadius: '6px',
            }}
          >
            <strong>{user.name}</strong>
            <br />
            Email: {user.email}
            <br />
            Status: {user.status}
          </div>
        )}

        {user && (
          <DemoButton
            onClick={handleRefresh}
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </DemoButton>
        )}
      </div>

      {/* Form Submission Demo */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '8px',
        }}
      >
        <h4>2. Async Form Submission Handler</h4>
        <form
          onSubmit={handleFormSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          <input
            type='text'
            placeholder='Enter name'
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
            }}
          />
          <input
            type='email'
            placeholder='Enter email'
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
            }}
          />
          <DemoButton
            type='submit'
            disabled={loading}
            style={{ alignSelf: 'flex-start' }}
          >
            {loading ? 'Submitting...' : 'Update Profile'}
          </DemoButton>
        </form>

        {submitResult && (
          <DemoOutput
            style={{
              marginTop: '1rem',
              background: submitResult.includes('✅') ? '#dcfce7' : '#fee2e2',
              color: submitResult.includes('✅') ? '#166534' : '#991b1b',
            }}
          >
            {submitResult}
          </DemoOutput>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <DemoOutput
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            marginBottom: '1.5rem',
          }}
        >
          Error: {error}
        </DemoOutput>
      )}

      {/* Code Examples */}
      <div>
        <h4>Code Patterns:</h4>
        <CodeSyntaxHighlighter language='typescript'>
          {`// Async button click handler
const handleButtonClick = async () => {
  setLoading(true)
  
  try {
    const data = await fetchUserData()
    setUser(data)
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}

// Async form submission handler
const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    // Validate form data
    if (!formData.name.trim()) {
      throw new Error('Name is required')
    }

    // Submit form
    await submitForm(formData)
    
    // Reset form on success
    setFormData(initialState)
    
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}

// Usage in JSX
<form onSubmit={handleFormSubmit}>
  <input onChange={handleInputChange} />
  <button type="submit" disabled={loading}>
    {loading ? 'Submitting...' : 'Submit'}
  </button>
</form>`}
        </CodeSyntaxHighlighter>
      </div>
    </DemoSection>
  )
}

export default AsyncEventHandlersDemo
