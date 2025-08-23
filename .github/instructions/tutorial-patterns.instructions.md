---
applyTo: '**'
---

# Tutorial-Specific Instructions

## Educational Focus

JavaScript Async Programming is an interactive educational project teaching JavaScript asynchronous programming patterns (async/await, Promises, resolve, then, etc.) specifically in React context. All code should prioritize educational clarity and progressive learning.

**Complete Curriculum**: For detailed chapter breakdowns, learning objectives, timelines, and assessment materials, see the comprehensive lesson plan at `docs/lesson-plan.md`.

## Tutorial Structure & Learning Objectives

### Core Topics Covered

- **Promise fundamentals** - Basic async operations and Promise lifecycle
- **Async/await syntax** - Modern asynchronous programming patterns
- **React integration** - Async operations in React components and hooks
- **Custom hooks** - Building reusable async logic (useFetch, useAsync patterns)
- **Error handling** - Graceful error management in async React applications
- **Performance optimization** - Efficient async patterns for better UX
- **Testing strategies** - Testing async React components and patterns

### Tutorial Progression

1. **Chapters 1-3**: Foundations (Promises → async/await → basic React patterns)
2. **Chapters 4-6**: Advanced patterns (React hooks, state management, custom hooks)
3. **Chapters 7-10**: Real-world applications (API integration, testing, performance, capstone project)

## Educational Code Standards

### Tutorial Component Patterns

Follow patterns optimized for educational clarity:

- **Clear, descriptive names**: Component and variable names should explain their purpose
- **Extensive comments**: Explain async concepts, Promise states, and transitions
- **Step-by-step progression**: Complex examples build up gradually
- **Error boundaries**: Safe tutorial execution with proper error handling
- **Loading states**: Clearly demonstrate async behavior with visual feedback

### Tutorial Example Standards

- **Before/After Examples**: Each pattern shows incorrect vs correct implementations
- **Common Mistakes**: Demonstrate pitfalls alongside proper solutions
- **Real-world Context**: Provide practical scenarios for each pattern
- **Performance Notes**: Explain implications in comments
- **Testing Examples**: Include relevant testing patterns where appropriate

### Educational Code Style

```typescript
// ✅ Educational Example - Clear and Descriptive
const [userDataLoadingState, setUserDataLoadingState] = useState<
  'idle' | 'loading' | 'success' | 'error'
>('idle')
const [userData, setUserData] = useState<User | null>(null)
const [userDataError, setUserDataError] = useState<string | null>(null)

// Simulate a real API call for educational purposes
const fetchUserData = async (userId: string): Promise<User> => {
  // Step 1: Set loading state to show async operation has started
  setUserDataLoadingState('loading')

  try {
    // Step 2: Simulate network delay (real API would have similar delay)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Step 3: Simulate potential API response
    const response = await fetch(`/api/users/${userId}`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const user = await response.json()

    // Step 4: Update state with successful data
    setUserData(user)
    setUserDataLoadingState('success')

    return user
  } catch (error) {
    // Step 5: Handle errors gracefully with user-friendly messages
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    setUserDataError(errorMessage)
    setUserDataLoadingState('error')
    throw error
  }
}
```

## Utility Functions for Async Tutorials

Create educational utilities in `src/utils/` that demonstrate async patterns:

```typescript
// src/utils/async-helpers.ts

/**
 * Simulates an API call with configurable delay
 * Educational purpose: Helps students understand async timing
 */
export const simulateApiCall = (delay: number = 1000): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Data loaded after ${delay}ms`), delay)
  })
}

/**
 * Simulates API call that randomly fails
 * Educational purpose: Demonstrates error handling patterns
 */
export const simulateUnreliableApiCall = (
  successRate: number = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < successRate) {
        resolve('Success!')
      } else {
        reject(new Error('Simulated API failure'))
      }
    }, 1000)
  })
}

/**
 * Creates a wrapper for tutorial examples with consistent logging
 * Educational purpose: Shows debugging patterns for async operations
 */
export const createAsyncExample = (
  name: string,
  operation: () => Promise<any>
) => {
  return async (...args: any[]) => {
    console.log(`🚀 Starting async operation: ${name}`)
    try {
      const result = await operation(...args)
      console.log(`✅ ${name} completed successfully:`, result)
      return result
    } catch (error) {
      console.log(`❌ ${name} failed:`, error)
      throw error
    }
  }
}
```

## Interactive Tutorial Components

### Code Syntax Highlighting

All code examples in tutorials use the `CodeSyntaxHighlighter` component for consistent, professional syntax highlighting with enforced dark theme:

```typescript
// Basic usage with JavaScript
<CodeSyntaxHighlighter language="javascript">
{`// Example JavaScript code
const fetchData = async () => {
  const response = await fetch('/api/data')
  return response.json()
}`}
</CodeSyntaxHighlighter>

// TypeScript/React examples
<CodeSyntaxHighlighter language="typescript" showLanguageLabel>
{`// React Hook example
const [data, setData] = useState<User[]>([])
const [loading, setLoading] = useState(false)

useEffect(() => {
  const loadData = async () => {
    setLoading(true)
    try {
      const result = await fetchUsers()
      setData(result)
    } finally {
      setLoading(false)
    }
  }
  loadData()
}, [])`}
</CodeSyntaxHighlighter>

// JSON API responses
<CodeSyntaxHighlighter language="json" showLineNumbers>
{`{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    ]
  }
}`}
</CodeSyntaxHighlighter>
```

#### CodeSyntaxHighlighter Props

- **`language`**: Programming language for syntax highlighting
  - `javascript` - JavaScript code
  - `typescript` - TypeScript/React code
  - `json` - JSON data/API responses
  - `css` - Stylesheets
  - `bash` - Terminal commands
  - And 200+ other languages supported by Prism.js

- **`showLanguageLabel`**: Display language name at top (default: `true`)
- **`showLineNumbers`**: Show line numbers (default: `false`)
- **`customStyle`**: Override default styling if needed

#### Code Block Best Practices

- **Use appropriate language**: Choose `typescript` for React code, `javascript` for plain JS
- **Show language labels**: Helps students understand what they're looking at
- **Include comments**: Explain complex async concepts within code examples
- **Consistent formatting**: All code blocks have enforced dark theme with generous padding
- **Educational clarity**: Prioritize readability over brevity in code examples

#### Migration from Old CodeBlock

```typescript
// ❌ Old pattern (deprecated)
<CodeBlock>
  {`const example = 'old way'`}
</CodeBlock>

// ✅ New pattern (use this)
<CodeSyntaxHighlighter language="javascript">
  {`const example = 'new way with syntax highlighting'`}
</CodeSyntaxHighlighter>
```

### Tutorial Layout Components

```typescript
// Educational components for consistent tutorial experience
export const TutorialSection = styled.section`
  background: #f8fafc;
  padding: 2rem;
  border-radius: 12px;
  margin: 2rem 0;
  border-left: 4px solid #3b82f6;
`

export const CodeExample = styled.pre`
  background: #1a202c;
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Monaco', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
`

export const LearningObjective = styled.div`
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;

  &::before {
    content: '💡 Learning Objective: ';
    font-weight: 600;
    color: #0369a1;
  }
`
```

### Interactive Demo Components

Create components that allow students to interact with async patterns:

```typescript
// Interactive async operation demo
function AsyncOperationDemo() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<string>('')

  const runAsyncOperation = async () => {
    setStatus('loading')
    try {
      const data = await simulateApiCall(2000)
      setResult(data)
      setStatus('success')
    } catch (error) {
      setResult(error.message)
      setStatus('error')
    }
  }

  return (
    <DemoContainer>
      <h3>Try It: Async Operation</h3>
      <button onClick={runAsyncOperation} disabled={status === 'loading'}>
        {status === 'loading' ? 'Loading...' : 'Start Async Operation'}
      </button>

      <StatusDisplay status={status}>
        {status === 'idle' && 'Ready to start'}
        {status === 'loading' && 'Operation in progress...'}
        {status === 'success' && `Success: ${result}`}
        {status === 'error' && `Error: ${result}`}
      </StatusDisplay>
    </DemoContainer>
  )
}
```

## Chapter Content Organization

### File Structure for Chapters

```
src/examples/
├── chapter01/                 # Foundation chapters
│   ├── PromiseBasics.tsx
│   ├── EventLoopDemo.tsx
│   └── AsyncCallbacks.tsx
├── chapter04/                 # Advanced chapters
│   ├── PromiseAll.tsx
│   ├── PromiseRace.tsx
│   └── ConcurrentPatterns.tsx
└── shared/                    # Shared tutorial components
    ├── DemoContainer.tsx
    ├── CodeRunner.tsx
    └── ProgressTracker.tsx
```

### Tutorial Metadata

Each chapter should include metadata for tracking progress:

```typescript
// Chapter metadata interface
interface ChapterMetadata {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  learningObjectives: string[]
  prerequisites: string[]
  keyWords: string[]
}

// Example usage in chapter components
export const chapterMetadata: ChapterMetadata = {
  id: 'chapter-01',
  title: 'Foundations of Asynchronous JavaScript',
  description:
    'Understanding the Event Loop, Promises, and basic async patterns',
  duration: '45 minutes',
  difficulty: 'Beginner',
  learningObjectives: [
    'Understand how the JavaScript event loop works',
    'Create and use basic Promises',
    'Handle Promise resolution and rejection',
  ],
  prerequisites: ['Basic JavaScript knowledge', 'Functions and callbacks'],
  keyWords: ['Promise', 'async', 'Event Loop', 'resolve', 'reject'],
}
```

## Progressive Learning Patterns

### Complexity Progression

1. **Start Simple**: Basic concepts with minimal code
2. **Add Context**: Real-world scenarios and use cases
3. **Show Alternatives**: Different approaches to same problem
4. **Optimize**: Performance and best practice improvements
5. **Test**: How to verify the implementation works

### Error Handling Progression

1. **No Error Handling**: Show what happens without it
2. **Basic Try-Catch**: Simple error handling
3. **User-Friendly Errors**: Meaningful error messages
4. **Error Recovery**: Retry mechanisms and fallbacks
5. **Error Boundaries**: React-specific error handling

## Accessibility in Tutorial Components

- Use semantic HTML elements
- Include ARIA labels for interactive elements
- Ensure keyboard navigation works
- Provide alternative text for visual elements
- Use color contrast that meets WCAG standards

## Performance Considerations for Educational Code

- Keep examples focused and lightweight
- Use realistic but not overwhelming data sets
- Include performance notes in comments
- Show both naive and optimized implementations
- Demonstrate monitoring and debugging techniques
