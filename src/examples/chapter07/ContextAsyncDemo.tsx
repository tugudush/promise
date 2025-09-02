import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoSection,
  ExampleTitle,
} from '@/examples/shared'
import {
  simulateApiCall,
  simulateUnreliableApiCall,
} from '@/utils/async-helpers'

// Types
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

interface LoginCredentials {
  email: string
  password: string
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void
}

// Mock API
const authApi = {
  async login(credentials: LoginCredentials): Promise<User> {
    await simulateApiCall(1000)

    // Simple mock validation
    if (
      credentials.email === 'admin@example.com' &&
      credentials.password === 'admin123'
    ) {
      return {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
      }
    }

    if (
      credentials.email === 'user@example.com' &&
      credentials.password === 'user123'
    ) {
      return {
        id: '2',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user',
      }
    }

    throw new Error('Invalid credentials')
  },

  async logout(): Promise<void> {
    await simulateApiCall(500)
  },

  async getCurrentUser(): Promise<User> {
    await simulateUnreliableApiCall(0.8) // 80% success rate
    return {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    }
  },
}

// Context Setup - Basic Pattern
const AuthContext = createContext<(AuthState & AuthActions) | undefined>(
  undefined
)

export function BasicAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  // Memoized async actions to prevent unnecessary re-renders
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const user = await authApi.login(credentials)
      setState({ user, loading: false, error: null })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }))
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }))

    try {
      await authApi.logout()
      setState({ user: null, loading: false, error: null })
    } catch {
      // Even if logout fails, clear local state
      setState({ user: null, loading: false, error: null })
    }
  }, [])

  const refreshUser = useCallback(async () => {
    if (!state.user) return

    try {
      const user = await authApi.getCurrentUser()
      setState((prev) => ({ ...prev, user }))
    } catch {
      // If refresh fails, user might be logged out
      setState({ user: null, loading: false, error: null })
    }
  }, [state.user])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authApi.getCurrentUser()
        setState({ user, loading: false, error: null })
      } catch {
        setState({ user: null, loading: false, error: null })
      }
    }

    checkAuth()
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      refreshUser,
      clearError,
    }),
    [state, login, logout, refreshUser, clearError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Context Setup - Optimized Pattern (Split Contexts)
const AuthStateContext = createContext<AuthState | undefined>(undefined)
const AuthActionsContext = createContext<AuthActions | undefined>(undefined)

export function OptimizedAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  // Actions are memoized and stable
  const actions = useMemo(
    () => ({
      login: async (credentials: LoginCredentials) => {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        try {
          const user = await authApi.login(credentials)
          setState({ user, loading: false, error: null })
        } catch {
          setState({ user: null, loading: false, error: null })
        }
      },

      logout: async () => {
        setState((prev) => ({ ...prev, loading: true }))

        try {
          await authApi.logout()
          setState({ user: null, loading: false, error: null })
        } catch {
          setState({ user: null, loading: false, error: null })
        }
      },

      refreshUser: async () => {
        if (!state.user) return

        try {
          const user = await authApi.getCurrentUser()
          setState((prev) => ({ ...prev, user }))
        } catch {
          setState({ user: null, loading: false, error: null })
        }
      },

      clearError: () => {
        setState((prev) => ({ ...prev, error: null }))
      },
    }),
    [state.user]
  )

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionsContext.Provider value={actions}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  )
}

// Custom hooks (internal to demo)
function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within BasicAuthProvider')
  }
  return context
}

function useAuthState() {
  const context = useContext(AuthStateContext)
  if (!context) {
    throw new Error('useAuthState must be used within OptimizedAuthProvider')
  }
  return context
}

function useAuthActions() {
  const context = useContext(AuthActionsContext)
  if (!context) {
    throw new Error('useAuthActions must be used within OptimizedAuthProvider')
  }
  return context
}

const DemoTitle = ExampleTitle

export function ContextAsyncDemo() {
  const [demoType, setDemoType] = useState<'basic' | 'optimized'>('basic')

  return (
    <DemoContainer>
      <DemoTitle>Context API with Async Operations</DemoTitle>

      <div style={{ marginBottom: '2rem' }}>
        <DemoButton
          onClick={() => setDemoType('basic')}
          disabled={demoType === 'basic'}
        >
          Basic Context Pattern
        </DemoButton>
        <DemoButton
          onClick={() => setDemoType('optimized')}
          disabled={demoType === 'optimized'}
        >
          Optimized Split Context
        </DemoButton>
      </div>

      {demoType === 'basic' ? (
        <BasicAuthProvider>
          <BasicContextDemo />
        </BasicAuthProvider>
      ) : (
        <OptimizedAuthProvider>
          <OptimizedContextDemo />
        </OptimizedAuthProvider>
      )}
    </DemoContainer>
  )
}

// Demo Components
function BasicContextDemo() {
  return (
    <DemoSection>
      <h3>Basic Context Pattern</h3>
      <p>Single context with combined state and actions.</p>

      <AuthDisplay />
      <LoginForm />
      <UserActions />

      <details style={{ marginTop: '1rem' }}>
        <summary>Pattern Explanation</summary>
        <CodeSyntaxHighlighter language='typescript'>
          {`// Single context combining state and actions
const AuthContext = createContext<(AuthState & AuthActions) | undefined>(undefined)

// All components re-render when any part of state changes
// Less performant but simpler to implement`}
        </CodeSyntaxHighlighter>
      </details>
    </DemoSection>
  )
}

function OptimizedContextDemo() {
  return (
    <DemoSection>
      <h3>Optimized Split Context Pattern</h3>
      <p>
        Separate contexts for state and actions to prevent unnecessary
        re-renders.
      </p>

      <OptimizedAuthDisplay />
      <OptimizedLoginForm />
      <OptimizedUserActions />

      <details style={{ marginTop: '1rem' }}>
        <summary>Pattern Explanation</summary>
        <CodeSyntaxHighlighter language='typescript'>
          {`// Split contexts - state and actions separate
const AuthStateContext = createContext<AuthState | undefined>(undefined)
const AuthActionsContext = createContext<AuthActions | undefined>(undefined)

// Components only re-render when their specific context changes
// More performant for complex applications`}
        </CodeSyntaxHighlighter>
      </details>
    </DemoSection>
  )
}

// Basic Context Components
function AuthDisplay() {
  const { user, loading, error } = useAuth()

  return (
    <div
      style={{
        padding: '1rem',
        margin: '1rem 0',
        backgroundColor: '#f8fafc',
        borderRadius: '6px',
      }}
    >
      <h4>Authentication Status</h4>

      {loading && <div style={{ color: '#92400e' }}>🔄 Loading...</div>}

      {error && (
        <div
          style={{
            padding: '0.5rem',
            backgroundColor: '#fee2e2',
            borderRadius: '4px',
            color: '#991b1b',
          }}
        >
          ❌ {error}
        </div>
      )}

      {user ? (
        <div
          style={{
            padding: '0.5rem',
            backgroundColor: '#dcfce7',
            borderRadius: '4px',
            color: '#166534',
          }}
        >
          ✅ Logged in as: {user.name} ({user.email})
          <br />
          Role: <strong>{user.role}</strong>
        </div>
      ) : (
        !loading && <div style={{ color: '#6b7280' }}>👤 Not logged in</div>
      )}
    </div>
  )
}

function LoginForm() {
  const { login, clearError, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
    } catch {
      // Error handled by context
    }
  }

  return (
    <div style={{ margin: '1rem 0' }}>
      <h4>Login Form</h4>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      >
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email (try: admin@example.com)'
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password (try: admin123)'
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        />
        <DemoButton type='submit' disabled={loading || !email || !password}>
          {loading ? 'Logging in...' : 'Login'}
        </DemoButton>
      </form>

      <div
        style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}
      >
        <strong>Test Credentials:</strong>
        <br />
        admin@example.com / admin123
        <br />
        user@example.com / user123
      </div>

      <DemoButton onClick={clearError} style={{ marginTop: '0.5rem' }}>
        Clear Error
      </DemoButton>
    </div>
  )
}

function UserActions() {
  const { user, logout, refreshUser, loading } = useAuth()

  if (!user) return null

  return (
    <div style={{ margin: '1rem 0' }}>
      <h4>User Actions</h4>
      <DemoButton onClick={logout} disabled={loading}>
        {loading ? 'Logging out...' : 'Logout'}
      </DemoButton>
      <DemoButton onClick={refreshUser} disabled={loading}>
        Refresh User Data
      </DemoButton>
    </div>
  )
}

// Optimized Context Components
function OptimizedAuthDisplay() {
  const { user, loading, error } = useAuthState()

  return (
    <div
      style={{
        padding: '1rem',
        margin: '1rem 0',
        backgroundColor: '#f8fafc',
        borderRadius: '6px',
      }}
    >
      <h4>Authentication Status (Optimized)</h4>

      {loading && <div style={{ color: '#92400e' }}>🔄 Loading...</div>}

      {error && (
        <div
          style={{
            padding: '0.5rem',
            backgroundColor: '#fee2e2',
            borderRadius: '4px',
            color: '#991b1b',
          }}
        >
          ❌ {error}
        </div>
      )}

      {user ? (
        <div
          style={{
            padding: '0.5rem',
            backgroundColor: '#dcfce7',
            borderRadius: '4px',
            color: '#166534',
          }}
        >
          ✅ Logged in as: {user.name} ({user.email})
          <br />
          Role: <strong>{user.role}</strong>
        </div>
      ) : (
        !loading && <div style={{ color: '#6b7280' }}>👤 Not logged in</div>
      )}
    </div>
  )
}

function OptimizedLoginForm() {
  const { login, clearError } = useAuthActions()
  const { loading } = useAuthState()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
    } catch {
      // Error handled by context
    }
  }

  return (
    <div style={{ margin: '1rem 0' }}>
      <h4>Login Form (Optimized)</h4>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      >
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email (try: admin@example.com)'
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password (try: admin123)'
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        />
        <DemoButton type='submit' disabled={loading || !email || !password}>
          {loading ? 'Logging in...' : 'Login'}
        </DemoButton>
      </form>

      <div
        style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}
      >
        <strong>Test Credentials:</strong>
        <br />
        admin@example.com / admin123
        <br />
        user@example.com / user123
      </div>

      <DemoButton onClick={clearError} style={{ marginTop: '0.5rem' }}>
        Clear Error
      </DemoButton>
    </div>
  )
}

function OptimizedUserActions() {
  const { logout, refreshUser } = useAuthActions()
  const { user, loading } = useAuthState()

  if (!user) return null

  return (
    <div style={{ margin: '1rem 0' }}>
      <h4>User Actions (Optimized)</h4>
      <DemoButton onClick={logout} disabled={loading}>
        {loading ? 'Logging out...' : 'Logout'}
      </DemoButton>
      <DemoButton onClick={refreshUser} disabled={loading}>
        Refresh User Data
      </DemoButton>
    </div>
  )
}
