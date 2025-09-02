import { createContext, useContext, useEffect, useState } from 'react'

import {
  CodeSyntaxHighlighter,
  DemoButton,
  DemoContainer,
  DemoSection,
  ExampleTitle,
} from '@/examples/shared'

const DemoTitle = ExampleTitle

// Simulated Jotai-like atoms for demonstration
// In a real app, you'd install: npm install jotai
interface Todo {
  id: string
  text: string
  completed: boolean
}

// Simple atom-like state management for demo
const createSimulatedAtom = <T,>(initialValue: T) => {
  let value = initialValue
  const listeners = new Set<() => void>()

  return {
    get: () => value,
    set: (newValue: T | ((prev: T) => T)) => {
      value =
        typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(value)
          : newValue
      listeners.forEach((listener) => listener())
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

// Demo atoms
const todoListAtom = createSimulatedAtom<Todo[]>([
  { id: '1', text: 'Learn about Jotai atoms', completed: false },
  { id: '2', text: 'Build interactive demo', completed: true },
])

const filterAtom = createSimulatedAtom<'all' | 'active' | 'completed'>('all')
const loadingAtom = createSimulatedAtom(false)

// Context for sharing atom state
const AtomContext = createContext<{
  todoListAtom: typeof todoListAtom
  filterAtom: typeof filterAtom
  loadingAtom: typeof loadingAtom
} | null>(null)

function useSimulatedAtom<T>(atom: ReturnType<typeof createSimulatedAtom<T>>) {
  const [, forceUpdate] = useState({})

  useEffect(() => {
    const unsubscribe = atom.subscribe(() => {
      forceUpdate({})
    })
    return unsubscribe
  }, [atom])

  return [atom.get(), atom.set] as const
}

export function JotaiDemo() {
  const [activeExample, setActiveExample] = useState<
    'basic' | 'async' | 'storage'
  >('basic')

  const examples = [
    {
      id: 'basic' as const,
      name: 'Basic Atoms',
      description: 'Todo list with derived atoms',
    },
    {
      id: 'async' as const,
      name: 'Async Atoms',
      description: 'Suspense integration',
    },
    {
      id: 'storage' as const,
      name: 'Persistent Atoms',
      description: 'localStorage sync',
    },
  ]

  return (
    <AtomContext.Provider value={{ todoListAtom, filterAtom, loadingAtom }}>
      <DemoContainer>
        <DemoTitle>Interactive Jotai Demo</DemoTitle>

        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fef3c7',
            borderRadius: '6px',
            marginBottom: '2rem',
          }}
        >
          <strong>📝 Note:</strong> This is a simulated Jotai demo. In a real
          application, install Jotai with:{' '}
          <code
            style={{
              backgroundColor: '#374151',
              color: '#e5e7eb',
              padding: '0.25rem',
            }}
          >
            npm install jotai
          </code>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          {examples.map((example) => (
            <DemoButton
              key={example.id}
              onClick={() => setActiveExample(example.id)}
              disabled={activeExample === example.id}
            >
              {example.name}
            </DemoButton>
          ))}
        </div>

        <DemoSection>
          <h3>{examples.find((e) => e.id === activeExample)?.name}</h3>
          <p>{examples.find((e) => e.id === activeExample)?.description}</p>

          {activeExample === 'basic' && <BasicAtomsDemo />}
          {activeExample === 'async' && <AsyncAtomsDemo />}
          {activeExample === 'storage' && <StorageAtomsDemo />}
        </DemoSection>
      </DemoContainer>
    </AtomContext.Provider>
  )
}

function BasicAtomsDemo() {
  const context = useContext(AtomContext)!
  const [todos, setTodos] = useSimulatedAtom(context.todoListAtom)
  const [filter, setFilter] = useSimulatedAtom(context.filterAtom)
  const [newTodoText, setNewTodoText] = useState('')

  // Derived values (computed)
  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'active':
        return !todo.completed
      case 'completed':
        return todo.completed
      default:
        return true
    }
  })

  const stats = {
    total: todos.length,
    active: todos.filter((todo) => !todo.completed).length,
    completed: todos.filter((todo) => todo.completed).length,
  }

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
      }
      setTodos((prev) => [...prev, newTodo])
      setNewTodoText('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  return (
    <div>
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderRadius: '6px',
          marginBottom: '1rem',
        }}
      >
        <h4>Todo Stats (Derived Atoms)</h4>
        <p>
          Total: {stats.total} | Active: {stats.active} | Completed:{' '}
          {stats.completed}
        </p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Filter: </label>
        {(['all', 'active', 'completed'] as const).map((filterOption) => (
          <label key={filterOption} style={{ marginLeft: '0.5rem' }}>
            <input
              type='radio'
              value={filterOption}
              checked={filter === filterOption}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
            />
            {filterOption}
          </label>
        ))}
      </div>

      <form onSubmit={handleAddTodo} style={{ marginBottom: '1rem' }}>
        <input
          type='text'
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder='Add new todo...'
          style={{
            padding: '0.5rem',
            marginRight: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type='submit'
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Add Todo
        </button>
      </form>

      <div>
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            style={{
              padding: '0.5rem',
              margin: '0.25rem 0',
              backgroundColor: todo.completed ? '#f0f9ff' : '#fefefe',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              type='checkbox'
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              style={{ marginRight: '0.5rem' }}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                opacity: todo.completed ? 0.6 : 1,
              }}
            >
              {todo.text}
            </span>
          </div>
        ))}
      </div>

      <CodeSyntaxHighlighter language='typescript' showLanguageLabel={false}>
        {`// Real Jotai atoms would look like this:
import { atom } from 'jotai'

const todoListAtom = atom<Todo[]>([...])
const filterAtom = atom<'all' | 'active' | 'completed'>('all')

// Derived atoms automatically recompute when dependencies change
const filteredTodosAtom = atom((get) => {
  const todos = get(todoListAtom)
  const filter = get(filterAtom)
  
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed)
    case 'completed':  
      return todos.filter(todo => todo.completed)
    default:
      return todos
  }
})

const todoStatsAtom = atom((get) => {
  const todos = get(todoListAtom)
  return {
    total: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length,
  }
})

// Usage in components
function TodoList() {
  const todos = useAtomValue(filteredTodosAtom)
  const stats = useAtomValue(todoStatsAtom)
  const [filter, setFilter] = useAtom(filterAtom)
  
  // Only re-renders when specific atoms change
}`}
      </CodeSyntaxHighlighter>
    </div>
  )
}

function AsyncAtomsDemo() {
  const context = useContext(AtomContext)!
  const [loading, setLoading] = useSimulatedAtom(context.loadingAtom)
  const [asyncData, setAsyncData] = useState<{
    message: string
    timestamp: string
  } | null>(null)

  const loadAsyncData = async () => {
    setLoading(true)
    setAsyncData(null)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setAsyncData({
      message: 'Data loaded from async atom!',
      timestamp: new Date().toLocaleTimeString(),
    })
    setLoading(false)
  }

  return (
    <div>
      <p>
        This demo shows how Jotai integrates with React Suspense for async
        operations.
      </p>

      <DemoButton onClick={loadAsyncData} disabled={loading}>
        {loading ? 'Loading...' : 'Load Async Data'}
      </DemoButton>

      <div style={{ marginTop: '1rem' }}>
        {loading && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#fef3c7',
              borderRadius: '6px',
            }}
          >
            ⏳ Loading async data...
          </div>
        )}

        {asyncData && !loading && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '6px',
              border: '1px solid #22c55e',
            }}
          >
            <h4>✅ Async Data Loaded</h4>
            <p>{asyncData.message}</p>
            <p>
              <small>Loaded at: {asyncData.timestamp}</small>
            </p>
          </div>
        )}

        {!asyncData && !loading && (
          <div>Click the button to load async data</div>
        )}
      </div>

      <CodeSyntaxHighlighter language='typescript' showLanguageLabel={false}>
        {`// Real Jotai async atoms with Suspense integration
import { atom } from 'jotai'

const loadingAtom = atom(false)

// Async atom that automatically suspends the component
const asyncDataAtom = atom(async (get) => {
  const loading = get(loadingAtom)
  if (!loading) return null
  
  // Simulate API call - component will suspend here
  const response = await fetch('/api/data')
  return response.json()
})

// Component usage with Suspense boundary
function AsyncDataDisplay() {
  const data = useAtomValue(asyncDataAtom)
  
  if (!data) return <div>No data loaded yet</div>
  return <div>{data.message}</div>
}

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <AsyncDataDisplay />
      </Suspense>
    </ErrorBoundary>
  )
}

// Alternative: Using atomWithQuery for more advanced async patterns
import { atomWithQuery } from 'jotai/query'

const usersQueryAtom = atomWithQuery(() => ({
  queryKey: ['users'],
  queryFn: async () => {
    const response = await fetch('/api/users')
    return response.json()
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
}))`}
      </CodeSyntaxHighlighter>
    </div>
  )
}

function StorageAtomsDemo() {
  const context = useContext(AtomContext)!
  const [filter] = useSimulatedAtom(context.filterAtom)
  const [storageValue, setStorageValue] = useState(() => {
    try {
      return localStorage.getItem('jotai-demo-value') || 'Hello Jotai!'
    } catch {
      return 'Hello Jotai!'
    }
  })

  const updateStorageValue = (newValue: string) => {
    setStorageValue(newValue)
    try {
      localStorage.setItem('jotai-demo-value', newValue)
    } catch {
      // Ignore localStorage errors
    }
  }

  return (
    <div>
      <p>
        This demo shows how Jotai can persist state to localStorage
        automatically.
      </p>

      <div
        style={{
          padding: '1rem',
          backgroundColor: '#fef3c7',
          borderRadius: '6px',
          marginBottom: '1rem',
        }}
      >
        <p>
          <strong>Current filter value:</strong> "{filter}"
        </p>
        <p>
          <small>
            In real Jotai, this would be automatically synced with localStorage.
          </small>
        </p>
      </div>

      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '6px',
          marginBottom: '1rem',
        }}
      >
        <label>
          <strong>Persistent Value:</strong>
          <input
            type='text'
            value={storageValue}
            onChange={(e) => updateStorageValue(e.target.value)}
            style={{
              marginLeft: '0.5rem',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </label>
        <p>
          <small>
            This value is stored in localStorage. Try refreshing the page!
          </small>
        </p>
      </div>

      <CodeSyntaxHighlighter language='typescript' showLanguageLabel={false}>
        {`// Real Jotai persistent atoms with localStorage
import { atomWithStorage } from 'jotai/utils'

// Automatically synced with localStorage
const filterAtom = atomWithStorage<'all' | 'active' | 'completed'>(
  'jotai-filter', // localStorage key
  'all'           // default value
)

const userPreferencesAtom = atomWithStorage('user-preferences', {
  theme: 'light',
  language: 'en',
  autoSave: true,
})

// The atomWithStorage utility automatically:
// 1. Reads initial value from localStorage on mount
// 2. Updates localStorage whenever the atom value changes
// 3. Handles JSON serialization/deserialization
// 4. Falls back to default value if localStorage is unavailable
// 5. Supports server-side rendering (no localStorage access)

// Usage is identical to regular atoms
function Settings() {
  const [preferences, setPreferences] = useAtom(userPreferencesAtom)
  const [filter, setFilter] = useAtom(filterAtom)
  
  return (
    <div>
      <label>
        Theme:
        <select 
          value={preferences.theme}
          onChange={(e) => setPreferences(prev => ({ 
            ...prev, 
            theme: e.target.value 
          }))}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      
      {/* Filter selection automatically persisted */}
      <FilterSelector filter={filter} setFilter={setFilter} />
    </div>
  )
}

// Alternative: Custom storage integration
import { atomWithStorage } from 'jotai/utils'

const sessionStorageAtom = atomWithStorage(
  'session-data',
  defaultValue,
  {
    getItem: (key) => sessionStorage.getItem(key),
    setItem: (key, value) => sessionStorage.setItem(key, value),
    removeItem: (key) => sessionStorage.removeItem(key),
  }
)

// Or integrate with external storage (Redis, IndexedDB, etc.)
const redisAtom = atomWithStorage(
  'redis-key',
  defaultValue,
  {
    getItem: async (key) => await redisClient.get(key),
    setItem: async (key, value) => await redisClient.set(key, value),
    removeItem: async (key) => await redisClient.del(key),
  }
)`}
      </CodeSyntaxHighlighter>
    </div>
  )
}
