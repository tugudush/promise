import { useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoSection,
  ExampleTitle,
} from '@/examples/shared'

const DemoTitle = ExampleTitle

export function StateLibrariesOverview() {
  const [activeLib, setActiveLib] = useState<'rtk-query' | 'zustand' | 'swr'>(
    'rtk-query'
  )

  const libraries = [
    {
      id: 'rtk-query' as const,
      name: 'Redux Toolkit Query',
      description: 'Powerful data fetching and caching built on Redux Toolkit',
      pros: [
        'Excellent caching',
        'Built-in optimistic updates',
        'TypeScript support',
        'DevTools integration',
      ],
      cons: ['Learning curve', 'Redux ecosystem required', 'More boilerplate'],
      useCase: 'Complex applications with heavy state management needs',
    },
    {
      id: 'zustand' as const,
      name: 'Zustand',
      description: 'Small, fast, and scalable state management solution',
      pros: [
        'Minimal boilerplate',
        'TypeScript friendly',
        'No providers needed',
        'Great DevTools',
      ],
      cons: [
        'Less mature ecosystem',
        'Manual cache management',
        'Fewer built-in patterns',
      ],
      useCase:
        'Medium to large apps that need global state without Redux complexity',
    },
    {
      id: 'swr' as const,
      name: 'SWR / React Query',
      description:
        'Data fetching libraries with built-in caching and synchronization',
      pros: [
        'Excellent caching',
        'Background updates',
        'Built-in loading states',
        'Easy to use',
      ],
      cons: [
        'Data fetching focused',
        'Limited global state',
        'Additional dependency',
      ],
      useCase: 'Applications focused on server state and data fetching',
    },
  ]

  const activeLibrary = libraries.find((lib) => lib.id === activeLib)!

  return (
    <DemoContainer>
      <DemoTitle>State Management Libraries Integration</DemoTitle>

      <div style={{ marginBottom: '2rem' }}>
        {libraries.map((lib) => (
          <DemoButton
            key={lib.id}
            onClick={() => setActiveLib(lib.id)}
            disabled={activeLib === lib.id}
          >
            {lib.name}
          </DemoButton>
        ))}
      </div>

      <DemoSection>
        <h3>{activeLibrary.name}</h3>
        <p>{activeLibrary.description}</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            margin: '1rem 0',
          }}
        >
          <div>
            <h4 style={{ color: '#166534' }}>✅ Pros</h4>
            <ul>
              {activeLibrary.pros.map((pro, index) => (
                <li key={index}>{pro}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#991b1b' }}>❌ Cons</h4>
            <ul>
              {activeLibrary.cons.map((con, index) => (
                <li key={index}>{con}</li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '6px',
            margin: '1rem 0',
          }}
        >
          <strong>Best Use Case:</strong> {activeLibrary.useCase}
        </div>

        {activeLib === 'rtk-query' && <RTKQueryExample />}
        {activeLib === 'zustand' && <ZustandExample />}
        {activeLib === 'swr' && <SWRExample />}
      </DemoSection>
    </DemoContainer>
  )
}

function RTKQueryExample() {
  return (
    <div>
      <h4>Redux Toolkit Query Example</h4>
      <CodeSyntaxHighlighter language='typescript'>
        {`// 1. API Slice Definition
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
      // Optimistic update
      onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
            draft.push({ ...arg, id: 'temp-' + Date.now() } as User)
          })
        )
        queryFulfilled.catch(patchResult.undo)
      },
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

// 2. Auto-generated hooks
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = usersApi

// 3. Component Usage
function UsersList() {
  const { 
    data: users = [], 
    isLoading, 
    error,
    refetch 
  } = useGetUsersQuery()
  
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      await createUser(userData).unwrap()
      // Automatically updates cache and triggers re-render
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  if (isLoading) return <div>Loading users...</div>
  if (error) return <div>Error loading users</div>

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
      <CreateUserForm 
        onSubmit={handleCreateUser}
        loading={isCreating}
      />
    </div>
  )
}`}
      </CodeSyntaxHighlighter>

      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '6px',
          margin: '1rem 0',
        }}
      >
        <strong>Key Features:</strong>
        <ul>
          <li>Automatic caching with smart invalidation</li>
          <li>Built-in optimistic updates</li>
          <li>Request deduplication</li>
          <li>Background refetching</li>
          <li>Powerful DevTools integration</li>
        </ul>
      </div>
    </div>
  )
}

function ZustandExample() {
  return (
    <div>
      <h4>Zustand with Async Actions Example</h4>
      <CodeSyntaxHighlighter language='typescript'>
        {`// 1. Store Definition
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
        const optimisticUser = { ...userData, id: 'temp-' + Date.now() }
        
        // Optimistic update
        set(state => ({ users: [...state.users, optimisticUser] }))
        
        try {
          const newUser = await api.createUser(userData)
          set(state => ({
            users: state.users.map(user => 
              user.id === optimisticUser.id ? newUser : user
            )
          }))
        } catch (error) {
          // Rollback optimistic update
          set(state => ({
            users: state.users.filter(user => user.id !== optimisticUser.id),
            error: error instanceof Error ? error.message : 'Failed to add user'
          }))
          throw error
        }
      },

      updateUser: async (id, updates) => {
        const originalUsers = get().users
        
        // Optimistic update
        set(state => ({
          users: state.users.map(user => 
            user.id === id ? { ...user, ...updates } : user
          )
        }))
        
        try {
          const updatedUser = await api.updateUser(id, updates)
          set(state => ({
            users: state.users.map(user => 
              user.id === id ? updatedUser : user
            )
          }))
        } catch (error) {
          // Rollback
          set({ 
            users: originalUsers,
            error: error instanceof Error ? error.message : 'Failed to update user' 
          })
          throw error
        }
      },

      deleteUser: async (id) => {
        const originalUsers = get().users
        
        // Optimistic removal
        set(state => ({
          users: state.users.filter(user => user.id !== id)
        }))
        
        try {
          await api.deleteUser(id)
        } catch (error) {
          // Rollback
          set({ 
            users: originalUsers,
            error: error instanceof Error ? error.message : 'Failed to delete user'
          })
          throw error
        }
      },

      reset: () => set({ users: [], loading: false, error: null }),
    }))
  )
)

// 2. Component Usage
function UsersList() {
  const { 
    users, 
    loading, 
    error, 
    fetchUsers, 
    addUser, 
    updateUser, 
    deleteUser 
  } = useUserStore()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleCreateUser = async (userData: Omit<User, 'id'>) => {
    try {
      await addUser(userData)
    } catch (error) {
      // Error already handled in store
    }
  }

  if (loading && users.length === 0) return <div>Loading users...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user}
          onUpdate={(updates) => updateUser(user.id, updates)}
          onDelete={() => deleteUser(user.id)}
        />
      ))}
      <CreateUserForm onSubmit={handleCreateUser} />
    </div>
  )
}

// 3. Selective subscriptions (performance optimization)
function UserCount() {
  const userCount = useUserStore(state => state.users.length)
  return <div>Total users: {userCount}</div>
}

function LoadingIndicator() {
  const loading = useUserStore(state => state.loading)
  return loading ? <div>Loading...</div> : null
}`}
      </CodeSyntaxHighlighter>

      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '6px',
          margin: '1rem 0',
        }}
      >
        <strong>Key Features:</strong>
        <ul>
          <li>No providers needed - works out of the box</li>
          <li>Selective subscriptions for performance</li>
          <li>Middleware ecosystem (devtools, persist, etc.)</li>
          <li>Built-in TypeScript support</li>
          <li>Easy to implement optimistic updates</li>
        </ul>
      </div>
    </div>
  )
}

function SWRExample() {
  return (
    <div>
      <h4>SWR (Stale-While-Revalidate) Example</h4>
      <CodeSyntaxHighlighter language='typescript'>
        {`// 1. Global Configuration
import useSWR, { SWRConfig, mutate } from 'swr'
import useSWRMutation from 'swr/mutation'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        errorRetryCount: 3,
        errorRetryInterval: 1000,
        // Global error handler
        onError: (error) => {
          console.error('SWR Error:', error)
        },
        // Global success handler
        onSuccess: (data, key) => {
          console.log('SWR Success:', key, data)
        }
      }}
    >
      {children}
    </SWRConfig>
  )
}

// 2. Custom Hooks for Data Fetching
export function useUsers() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<User[]>('/api/users')
  
  return {
    users: data,
    loading: isLoading,
    validating: isValidating,
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

// 3. Mutations with SWR
async function createUser(url: string, { arg }: { arg: Omit<User, 'id'> }) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  return response.json()
}

async function updateUser(
  url: string, 
  { arg }: { arg: { id: string; updates: Partial<User> } }
) {
  const response = await fetch(\`\${url}/\${arg.id}\`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg.updates),
  })
  return response.json()
}

export function useCreateUser() {
  const { trigger, isMutating, error } = useSWRMutation('/api/users', createUser, {
    onSuccess: (data) => {
      // Optimistic update - add to users list
      mutate('/api/users', (users: User[] = []) => [...users, data], false)
    },
  })
  
  return {
    createUser: trigger,
    loading: isMutating,
    error: error?.message,
  }
}

export function useUpdateUser() {
  const { trigger, isMutating, error } = useSWRMutation('/api/users', updateUser, {
    onSuccess: (updatedUser, key, { arg }) => {
      // Update specific user
      mutate(\`/api/users/\${arg.id}\`, updatedUser, false)
      // Update users list
      mutate('/api/users', (users: User[] = []) => 
        users.map(user => user.id === arg.id ? updatedUser : user), false
      )
    },
  })
  
  return {
    updateUser: trigger,
    loading: isMutating,
    error: error?.message,
  }
}

// 4. Component Usage
function UsersList() {
  const { users = [], loading, error, refresh } = useUsers()
  const { createUser, loading: isCreating } = useCreateUser()

  const handleCreateUser = async (userData: Omit<User, 'id'>) => {
    try {
      await createUser(userData)
      // SWR automatically updates the cache
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  if (loading) return <div>Loading users...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
      <CreateUserForm 
        onSubmit={handleCreateUser}
        loading={isCreating}
      />
    </div>
  )
}

// 5. Advanced: Dependent Queries
function UserProfile({ userId }: { userId: string }) {
  const { user, loading: userLoading } = useUser(userId)
  const { data: posts, loading: postsLoading } = useSWR<Post[]>(
    user ? \`/api/users/\${user.id}/posts\` : null
  )

  if (userLoading) return <div>Loading user...</div>
  if (!user) return <div>User not found</div>

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      
      {postsLoading ? (
        <div>Loading posts...</div>
      ) : (
        <div>
          {posts?.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

// 6. Real-time Updates
function useRealtimeUsers() {
  const { data, error, mutate } = useSWR('/api/users')

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')
    
    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data)
      
      if (type === 'user_updated') {
        // Update cache with real-time data
        mutate((users: User[] = []) => 
          users.map(user => user.id === data.id ? data : user), false
        )
      }
    }

    return () => ws.close()
  }, [mutate])

  return { users: data, error }
}`}
      </CodeSyntaxHighlighter>

      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '6px',
          margin: '1rem 0',
        }}
      >
        <strong>Key Features:</strong>
        <ul>
          <li>Automatic revalidation and caching</li>
          <li>Built-in loading and error states</li>
          <li>Focus revalidation and background updates</li>
          <li>Request deduplication</li>
          <li>Real-time data synchronization</li>
          <li>Offline support and error retry</li>
        </ul>
      </div>
    </div>
  )
}
