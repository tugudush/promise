import { useState } from 'react'

import { CodeSyntaxHighlighter } from '@/examples/shared'
import {
  CodeBlock,
  DemoContainer,
  DemoSection,
  ExampleTitle,
  LearningObjective,
} from '@/examples/shared/TutorialComponents.styles'

import { ContextAsyncDemo } from './ContextAsyncDemo'
import { LocalStateDemo } from './LocalStateDemo'
import { StateLibrariesOverview } from './StateLibrariesOverview'

const ChapterContainer = DemoContainer
const ChapterTitle = ExampleTitle
const Section = DemoSection
const SectionTitle = ExampleTitle
const Text = ({ children }: { children: React.ReactNode }) => <p>{children}</p>

// Create simple styled components for navigation
const NavigationButtons = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '2rem',
      padding: '1rem 0',
    }}
  >
    {children}
  </div>
)

const BackButton = ({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '0.75rem 1.5rem',
      backgroundColor: disabled ? '#d1d5db' : '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}
  >
    {children}
  </button>
)

const NextButton = ({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '0.75rem 1.5rem',
      backgroundColor: disabled ? '#d1d5db' : '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}
  >
    {children}
  </button>
)

export default function Chapter07Content() {
  const [currentSection, setCurrentSection] = useState(0)

  const sections = [
    {
      title: 'Local State Patterns with Async Operations',
      content: <LocalStatePatternsSection />,
      demo: <LocalStateDemo />,
    },
    {
      title: 'Context API and Async Operations',
      content: <ContextAsyncSection />,
      demo: <ContextAsyncDemo />,
    },
    {
      title: 'Integration with State Libraries',
      content: <StateLibrariesSection />,
      demo: <StateLibrariesOverview />,
    },
  ]

  const currentSectionData = sections[currentSection]

  return (
    <ChapterContainer>
      <ChapterTitle>
        Chapter 7: State Management with Async Operations
      </ChapterTitle>

      <LearningObjective>
        <strong>Learning Objectives:</strong>
        <ul>
          <li>Master local state patterns for async operations</li>
          <li>Implement async operations with React Context</li>
          <li>
            Understand integration patterns with state management libraries
          </li>
          <li>Build robust state management for complex async flows</li>
        </ul>
      </LearningObjective>

      <Section>
        <SectionTitle>{currentSectionData.title}</SectionTitle>
        {currentSectionData.content}
        {currentSectionData.demo}
      </Section>

      <NavigationButtons>
        <BackButton
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
        >
          Previous Section
        </BackButton>
        <span>
          {currentSection + 1} of {sections.length}
        </span>
        <NextButton
          onClick={() =>
            setCurrentSection(Math.min(sections.length - 1, currentSection + 1))
          }
          disabled={currentSection === sections.length - 1}
        >
          Next Section
        </NextButton>
      </NavigationButtons>
    </ChapterContainer>
  )
}

// Section 1: Local State Patterns
function LocalStatePatternsSection() {
  return (
    <>
      <Text>
        Managing async operations requires careful state management. React
        applications often need to handle multiple async states simultaneously
        while providing excellent user experience.
      </Text>

      <Text>
        <strong>Common State Patterns for Async Operations:</strong>
      </Text>

      <CodeSyntaxHighlighter language='typescript'>
        {`// 1. Basic Loading/Error/Data Pattern
interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

function useAsyncState<T>(): [AsyncState<T>, {
  setLoading: () => void
  setSuccess: (data: T) => void
  setError: (error: string) => void
  reset: () => void
}] {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const setLoading = useCallback(() => {
    setState({ data: null, loading: true, error: null })
  }, [])

  const setSuccess = useCallback((data: T) => {
    setState({ data, loading: false, error: null })
  }, [])

  const setError = useCallback((error: string) => {
    setState({ data: null, loading: false, error })
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return [state, { setLoading, setSuccess, setError, reset }]
}`}
      </CodeSyntaxHighlighter>

      <Text>
        <strong>Advanced State Patterns:</strong>
      </Text>

      <CodeSyntaxHighlighter language='typescript'>
        {`// 2. Normalized State for Complex Data
interface User {
  id: string
  name: string
  email: string
}

interface NormalizedState {
  users: {
    byId: Record<string, User>
    allIds: string[]
  }
  ui: {
    loading: boolean
    error: string | null
    selectedUserId: string | null
  }
}

// Reducer for normalized async state
function usersReducer(state: NormalizedState, action: any): NormalizedState {
  switch (action.type) {
    case 'FETCH_USERS_START':
      return {
        ...state,
        ui: { ...state.ui, loading: true, error: null }
      }
    
    case 'FETCH_USERS_SUCCESS':
      const users = action.payload
      return {
        users: {
          byId: users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {}),
          allIds: users.map(user => user.id)
        },
        ui: { ...state.ui, loading: false, error: null }
      }
    
    case 'FETCH_USERS_ERROR':
      return {
        ...state,
        ui: { ...state.ui, loading: false, error: action.payload }
      }
    
    default:
      return state
  }
}`}
      </CodeSyntaxHighlighter>

      <Text>
        <strong>Optimistic Updates Pattern:</strong>
      </Text>

      <CodeSyntaxHighlighter language='typescript'>
        {`// 3. Optimistic Updates with Rollback
function useOptimisticState<T>(initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData)
  const [optimisticOperations, setOptimisticOperations] = useState<Map<string, T>>(new Map())

  const addOptimistic = useCallback(async (item: T, apiCall: () => Promise<T>) => {
    const tempId = 'temp_' + Date.now()
    const optimisticItem = { ...item, id: tempId }
    
    // Add optimistically
    setData(prev => [...prev, optimisticItem])
    setOptimisticOperations(prev => new Map(prev).set(tempId, optimisticItem))

    try {
      const result = await apiCall()
      
      // Replace optimistic with real data
      setData(prev => prev.map(i => i.id === tempId ? result : i))
      setOptimisticOperations(prev => {
        const next = new Map(prev)
        next.delete(tempId)
        return next
      })
      
      return result
    } catch (error) {
      // Rollback optimistic update
      setData(prev => prev.filter(i => i.id !== tempId))
      setOptimisticOperations(prev => {
        const next = new Map(prev)
        next.delete(tempId)
        return next
      })
      throw error
    }
  }, [])

  return { data, addOptimistic, hasOptimisticOperations: optimisticOperations.size > 0 }
}`}
      </CodeSyntaxHighlighter>
    </>
  )
}

// Section 2: Context API and Async Operations
function ContextAsyncSection() {
  return (
    <>
      <Text>
        React Context is powerful for sharing async state across components.
        However, it requires careful design to avoid performance issues and
        ensure proper error handling.
      </Text>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Context Provider with Async Operations
interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  // Memoize async actions to prevent unnecessary re-renders
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const user = await authApi.login(credentials)
      setState({ user, loading: false, error: null })
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }))
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      await authApi.logout()
      setState({ user: null, loading: false, error: null })
    } catch (error) {
      // Even if logout fails, clear local state
      setState({ user: null, loading: false, error: null })
    }
  }, [])

  const refreshUser = useCallback(async () => {
    if (!state.user) return
    
    try {
      const user = await authApi.getCurrentUser()
      setState(prev => ({ ...prev, user }))
    } catch (error) {
      // If refresh fails, user might be logged out
      setState({ user: null, loading: false, error: null })
    }
  }, [state.user])

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

  const value = useMemo(() => ({
    ...state,
    login,
    logout,
    refreshUser,
  }), [state, login, logout, refreshUser])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}`}
      </CodeSyntaxHighlighter>

      <Text>
        <strong>Optimized Context Pattern:</strong>
      </Text>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Split context to prevent unnecessary re-renders
const AuthStateContext = createContext<AuthState | undefined>(undefined)
const AuthActionsContext = createContext<AuthActions | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  // Actions are memoized and stable
  const actions = useMemo(() => ({
    login: async (credentials: LoginCredentials) => {
      // ... login implementation
    },
    logout: async () => {
      // ... logout implementation
    },
  }), [])

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionsContext.Provider value={actions}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  )
}

// Separate hooks for state and actions
export function useAuthState() {
  const context = useContext(AuthStateContext)
  if (!context) {
    throw new Error('useAuthState must be used within AuthProvider')
  }
  return context
}

export function useAuthActions() {
  const context = useContext(AuthActionsContext)
  if (!context) {
    throw new Error('useAuthActions must be used within AuthProvider')
  }
  return context
}`}
      </CodeSyntaxHighlighter>
    </>
  )
}

// Section 3: State Libraries Integration
function StateLibrariesSection() {
  return (
    <>
      <Text>
        Modern state management libraries provide excellent async operation
        support. Here's how to integrate with popular libraries for robust async
        state management.
      </Text>

      <Text>
        <strong>1. Redux Toolkit Query (RTK Query):</strong>
      </Text>

      <CodeSyntaxHighlighter language='typescript'>
        {`// RTK Query API Slice
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', \`Bearer \${token}\`)
      }
      return headers
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => \`users/\${id}\`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: 'users',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<User, { id: string; updates: Partial<User> }>({
      query: ({ id, updates }) => ({
        url: \`users/\${id}\`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
  }),
})

// Auto-generated hooks
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = usersApi`}
      </CodeSyntaxHighlighter>

      <Text>
        <strong>2. Zustand with Async Actions:</strong>
      </Text>

      <CodeSyntaxHighlighter language='typescript'>
        {`// Zustand Store with Async Actions
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

interface UserStore {
  // State
  users: User[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchUsers: () => Promise<void>
  addUser: (user: Omit<User, 'id'>) => Promise<void>
  updateUser: (id: string, updates: Partial<User>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  
  // Utilities
  reset: () => void
}

export const useUserStore = create<UserStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      users: [],
      loading: false,
      error: null,

      // Async actions
      fetchUsers: async () => {
        set({ loading: true, error: null })
        
        try {
          const users = await api.getUsers()
          set({ users, loading: false })
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch users' 
          })
        }
      },

      addUser: async (userData) => {
        try {
          const newUser = await api.createUser(userData)
          set(state => ({ users: [...state.users, newUser] }))
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add user' })
          throw error
        }
      },

      updateUser: async (id, updates) => {
        try {
          const updatedUser = await api.updateUser(id, updates)
          set(state => ({
            users: state.users.map(user => 
              user.id === id ? updatedUser : user
            )
          }))
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update user' })
          throw error
        }
      },

      deleteUser: async (id) => {
        try {
          await api.deleteUser(id)
          set(state => ({
            users: state.users.filter(user => user.id !== id)
          }))
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete user' })
          throw error
        }
      },

      reset: () => set({ users: [], loading: false, error: null }),
    }))
  )
)`}
      </CodeSyntaxHighlighter>

      <Text>
        <strong>3. SWR for Data Fetching:</strong>
      </Text>

      <CodeSyntaxHighlighter language='typescript'>
        {`// SWR Configuration and Custom Hooks
import useSWR, { SWRConfig, mutate } from 'swr'
import useSWRMutation from 'swr/mutation'

// Global SWR configuration
export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then(res => res.json()),
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        errorRetryCount: 3,
        errorRetryInterval: 1000,
      }}
    >
      {children}
    </SWRConfig>
  )
}

// Custom hooks with SWR
export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>('/api/users')
  
  return {
    users: data,
    loading: isLoading,
    error: error?.message,
    refresh: mutate,
  }
}

export function useUser(id: string) {
  const { data, error, isLoading } = useSWR<User>(
    id ? \`/api/users/\${id}\` : null
  )
  
  return {
    user: data,
    loading: isLoading,
    error: error?.message,
  }
}

// Mutations with SWR
async function createUser(url: string, { arg }: { arg: Omit<User, 'id'> }) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  return response.json()
}

export function useCreateUser() {
  const { trigger, isMutating, error } = useSWRMutation('/api/users', createUser, {
    onSuccess: (data) => {
      // Optimistic update
      mutate('/api/users', (users: User[] = []) => [...users, data], false)
    },
  })
  
  return {
    createUser: trigger,
    loading: isMutating,
    error: error?.message,
  }
}`}
      </CodeSyntaxHighlighter>

      <Text>
        <strong>Choosing the Right State Management Solution:</strong>
      </Text>

      <CodeBlock>
        <strong>Local React State:</strong> Simple async operations,
        component-specific state
        <br />
        <strong>Context API:</strong> Shared async state, moderate complexity
        <br />
        <strong>RTK Query:</strong> Complex API integrations, caching
        requirements
        <br />
        <strong>Zustand:</strong> Global state with async actions, flexible
        patterns
        <br />
        <strong>SWR/React Query:</strong> Data fetching focused, excellent
        caching
      </CodeBlock>
    </>
  )
}
