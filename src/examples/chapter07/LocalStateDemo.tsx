import { useCallback, useReducer, useState } from 'react'

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

interface User {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
}

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// Basic async state hook
function useAsyncState<T>(): [
  AsyncState<T>,
  {
    setLoading: () => void
    setSuccess: (data: T) => void
    setError: (error: string) => void
    reset: () => void
  },
] {
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
}

// Normalized state reducer
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

type NormalizedAction =
  | { type: 'FETCH_USERS_START' }
  | { type: 'FETCH_USERS_SUCCESS'; payload: User[] }
  | { type: 'FETCH_USERS_ERROR'; payload: string }
  | { type: 'SELECT_USER'; payload: string }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }

function normalizedReducer(
  state: NormalizedState,
  action: NormalizedAction
): NormalizedState {
  switch (action.type) {
    case 'FETCH_USERS_START':
      return {
        ...state,
        ui: { ...state.ui, loading: true, error: null },
      }

    case 'FETCH_USERS_SUCCESS': {
      const users = action.payload
      return {
        users: {
          byId: users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {}),
          allIds: users.map((user) => user.id),
        },
        ui: { ...state.ui, loading: false, error: null },
      }
    }

    case 'FETCH_USERS_ERROR':
      return {
        ...state,
        ui: { ...state.ui, loading: false, error: action.payload },
      }

    case 'SELECT_USER':
      return {
        ...state,
        ui: { ...state.ui, selectedUserId: action.payload },
      }

    case 'UPDATE_USER':
      return {
        ...state,
        users: {
          ...state.users,
          byId: {
            ...state.users.byId,
            [action.payload.id]: action.payload,
          },
        },
      }

    case 'DELETE_USER': {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: _, ...remainingUsers } = state.users.byId
      return {
        ...state,
        users: {
          byId: remainingUsers,
          allIds: state.users.allIds.filter((id) => id !== action.payload),
        },
        ui: {
          ...state.ui,
          selectedUserId:
            state.ui.selectedUserId === action.payload
              ? null
              : state.ui.selectedUserId,
        },
      }
    }

    default:
      return state
  }
}

// Optimistic updates hook
function useOptimisticState<T extends { id: string }>(initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData)
  const [optimisticOperations, setOptimisticOperations] = useState<
    Map<string, T>
  >(new Map())

  const addOptimistic = useCallback(
    async (item: Omit<T, 'id'>, apiCall: () => Promise<T>) => {
      const tempId = 'temp_' + Date.now()
      const optimisticItem = { ...item, id: tempId } as T

      // Add optimistically
      setData((prev) => [...prev, optimisticItem])
      setOptimisticOperations((prev) =>
        new Map(prev).set(tempId, optimisticItem)
      )

      try {
        const result = await apiCall()

        // Replace optimistic with real data
        setData((prev) => prev.map((i) => (i.id === tempId ? result : i)))
        setOptimisticOperations((prev) => {
          const next = new Map(prev)
          next.delete(tempId)
          return next
        })

        return result
      } catch (error) {
        // Rollback optimistic update
        setData((prev) => prev.filter((i) => i.id !== tempId))
        setOptimisticOperations((prev) => {
          const next = new Map(prev)
          next.delete(tempId)
          return next
        })
        throw error
      }
    },
    []
  )

  const updateOptimistic = useCallback(
    async (id: string, updates: Partial<T>, apiCall: () => Promise<T>) => {
      const originalItem = data.find((item) => item.id === id)
      if (!originalItem) throw new Error('Item not found')

      // Apply optimistic update
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      )

      try {
        const result = await apiCall()
        setData((prev) => prev.map((item) => (item.id === id ? result : item)))
        return result
      } catch (error) {
        // Rollback to original
        setData((prev) =>
          prev.map((item) => (item.id === id ? originalItem : item))
        )
        throw error
      }
    },
    [data]
  )

  return {
    data,
    addOptimistic,
    updateOptimistic,
    hasOptimisticOperations: optimisticOperations.size > 0,
  }
}

const DemoTitle = ExampleTitle

export function LocalStateDemo() {
  return (
    <DemoContainer>
      <DemoTitle>Local State Patterns with Async Operations</DemoTitle>

      <BasicAsyncStateDemo />
      <NormalizedStateDemo />
      <OptimisticUpdatesDemo />
    </DemoContainer>
  )
}

// Demo 1: Basic Async State Management
function BasicAsyncStateDemo() {
  const [userState, userActions] = useAsyncState<User>()

  const fetchUser = async () => {
    userActions.setLoading()

    try {
      await simulateApiCall(1500)
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active',
      }
      userActions.setSuccess(user)
    } catch (error) {
      userActions.setError(
        error instanceof Error ? error.message : 'Failed to fetch user'
      )
    }
  }

  const fetchUserWithError = async () => {
    userActions.setLoading()

    try {
      await simulateUnreliableApiCall(0.3) // 30% success rate
      const user: User = {
        id: '1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        status: 'active',
      }
      userActions.setSuccess(user)
    } catch (error) {
      userActions.setError(
        error instanceof Error ? error.message : 'Failed to fetch user'
      )
    }
  }

  return (
    <DemoSection>
      <h3>Basic Async State Hook</h3>

      <div style={{ marginBottom: '1rem' }}>
        <DemoButton onClick={fetchUser} disabled={userState.loading}>
          Fetch User (Success)
        </DemoButton>
        <DemoButton onClick={fetchUserWithError} disabled={userState.loading}>
          Fetch User (Unreliable)
        </DemoButton>
        <DemoButton onClick={userActions.reset}>Reset</DemoButton>
      </div>

      {userState.loading && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fef3c7',
            borderRadius: '6px',
            margin: '1rem 0',
          }}
        >
          Loading user...
        </div>
      )}

      {userState.error && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            borderRadius: '6px',
            margin: '1rem 0',
          }}
        >
          Error: {userState.error}
        </div>
      )}

      {userState.data && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#dcfce7',
            borderRadius: '6px',
            margin: '1rem 0',
          }}
        >
          <strong>User Loaded:</strong>
          <br />
          Name: {userState.data.name}
          <br />
          Email: {userState.data.email}
          <br />
          Status:{' '}
          <span
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              backgroundColor:
                userState.data.status === 'active' ? '#dcfce7' : '#fef3c7',
              color: userState.data.status === 'active' ? '#166534' : '#92400e',
            }}
          >
            {userState.data.status}
          </span>
        </div>
      )}

      <details style={{ marginTop: '1rem' }}>
        <summary>Current State (Debug)</summary>
        <CodeSyntaxHighlighter language='json'>
          {JSON.stringify(userState, null, 2)}
        </CodeSyntaxHighlighter>
      </details>
    </DemoSection>
  )
}

// Demo 2: Normalized State Management
function NormalizedStateDemo() {
  const [state, dispatch] = useReducer(normalizedReducer, {
    users: {
      byId: {},
      allIds: [],
    },
    ui: {
      loading: false,
      error: null,
      selectedUserId: null,
    },
  })

  const fetchUsers = async () => {
    dispatch({ type: 'FETCH_USERS_START' })

    try {
      await simulateApiCall(1000)
      const users: User[] = [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          status: 'active',
        },
        {
          id: '2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          status: 'inactive',
        },
        {
          id: '3',
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          status: 'active',
        },
      ]
      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: users })
    } catch (error) {
      dispatch({
        type: 'FETCH_USERS_ERROR',
        payload:
          error instanceof Error ? error.message : 'Failed to fetch users',
      })
    }
  }

  const updateUserStatus = async (userId: string) => {
    const user = state.users.byId[userId]
    if (!user) return

    const updatedUser = {
      ...user,
      status: user.status === 'active' ? 'inactive' : 'active',
    } as User

    try {
      await simulateApiCall(500)
      dispatch({ type: 'UPDATE_USER', payload: updatedUser })
    } catch {
      // Handle error silently for demo purposes
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      await simulateApiCall(500)
      dispatch({ type: 'DELETE_USER', payload: userId })
    } catch {
      // Handle error silently for demo purposes
    }
  }

  const selectedUser = state.ui.selectedUserId
    ? state.users.byId[state.ui.selectedUserId]
    : null

  return (
    <DemoSection>
      <h3>Normalized State Management</h3>

      <div style={{ marginBottom: '1rem' }}>
        <DemoButton onClick={fetchUsers} disabled={state.ui.loading}>
          Load Users
        </DemoButton>
      </div>

      {state.ui.loading && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fef3c7',
            borderRadius: '6px',
            margin: '1rem 0',
          }}
        >
          Loading users...
        </div>
      )}

      {state.ui.error && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            borderRadius: '6px',
            margin: '1rem 0',
          }}
        >
          Error: {state.ui.error}
        </div>
      )}

      {state.users.allIds.length > 0 && (
        <div>
          <h4>Users ({state.users.allIds.length})</h4>
          {state.users.allIds.map((id) => {
            const user = state.users.byId[id]
            return (
              <div
                key={id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem',
                  margin: '0.5rem 0',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor:
                    state.ui.selectedUserId === id ? '#f0f9ff' : 'white',
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong>{user.name}</strong> - {user.email}
                  <span
                    style={{
                      marginLeft: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      backgroundColor:
                        user.status === 'active' ? '#dcfce7' : '#fef3c7',
                      color: user.status === 'active' ? '#166534' : '#92400e',
                    }}
                  >
                    {user.status}
                  </span>
                </div>
                <DemoButton
                  onClick={() =>
                    dispatch({
                      type: 'SELECT_USER',
                      payload: state.ui.selectedUserId === id ? '' : id,
                    })
                  }
                >
                  {state.ui.selectedUserId === id ? 'Deselect' : 'Select'}
                </DemoButton>
                <DemoButton onClick={() => updateUserStatus(id)}>
                  Toggle Status
                </DemoButton>
                <DemoButton onClick={() => deleteUser(id)}>Delete</DemoButton>
              </div>
            )
          })}

          {selectedUser && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '4px',
              }}
            >
              <h4>Selected User Details</h4>
              <CodeSyntaxHighlighter language='json'>
                {JSON.stringify(selectedUser, null, 2)}
              </CodeSyntaxHighlighter>
            </div>
          )}
        </div>
      )}
    </DemoSection>
  )
}

// Demo 3: Optimistic Updates
function OptimisticUpdatesDemo() {
  const {
    data: todos,
    addOptimistic,
    updateOptimistic,
    hasOptimisticOperations,
  } = useOptimisticState<{
    id: string
    title: string
    completed: boolean
  }>([
    { id: '1', title: 'Learn React', completed: true },
    { id: '2', title: 'Master async patterns', completed: false },
  ])

  const [newTodoTitle, setNewTodoTitle] = useState('')

  const addTodo = async () => {
    if (!newTodoTitle.trim()) return

    try {
      await addOptimistic(
        { title: newTodoTitle, completed: false },
        async () => {
          await simulateApiCall(1000)
          return {
            id: Date.now().toString(),
            title: newTodoTitle,
            completed: false,
          }
        }
      )
      setNewTodoTitle('')
    } catch {
      // Handle error silently for demo purposes
    }
  }

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    try {
      await updateOptimistic(id, { completed: !todo.completed }, async () => {
        await simulateUnreliableApiCall(0.7) // 70% success rate
        return { ...todo, completed: !todo.completed }
      })
    } catch {
      // Handle error silently for demo purposes
    }
  }

  return (
    <DemoSection>
      <h3>Optimistic Updates</h3>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type='text'
          value={newTodoTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewTodoTitle(e.target.value)
          }
          placeholder='Enter todo title...'
          onKeyPress={(e: React.KeyboardEvent) =>
            e.key === 'Enter' && addTodo()
          }
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginRight: '0.5rem',
          }}
        />
        <DemoButton onClick={addTodo} disabled={!newTodoTitle.trim()}>
          Add Todo
        </DemoButton>
      </div>

      {hasOptimisticOperations && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#fef3c7',
            borderRadius: '4px',
          }}
        >
          ⏳ Optimistic operations in progress...
        </div>
      )}

      <div>
        {todos.map((todo) => (
          <div
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              margin: '0.5rem 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: todo.id.startsWith('temp_')
                ? '#fef3c7'
                : 'white',
              opacity: todo.id.startsWith('temp_') ? 0.7 : 1,
            }}
          >
            <div style={{ flex: 1 }}>
              <span
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#6b7280' : 'inherit',
                }}
              >
                {todo.title}
              </span>
              {todo.id.startsWith('temp_') && (
                <span
                  style={{
                    marginLeft: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                  }}
                >
                  Saving...
                </span>
              )}
            </div>
            <DemoButton
              onClick={() => toggleTodo(todo.id)}
              disabled={todo.id.startsWith('temp_')}
            >
              {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </DemoButton>
          </div>
        ))}
      </div>

      <details style={{ marginTop: '1rem' }}>
        <summary>Todo State (Debug)</summary>
        <CodeSyntaxHighlighter language='json'>
          {JSON.stringify(todos, null, 2)}
        </CodeSyntaxHighlighter>
      </details>
    </DemoSection>
  )
}
