import {
  AsyncAwaitBasicsDemo,
  AsyncEventHandlersDemo,
  AsyncToAwaitConversionDemo,
  TryCatchPatternsDemo,
} from '@/examples/chapter04'
import {
  CodeSyntaxHighlighter,
  ImportantNote,
  LearningObjective,
  SuccessNote,
  TutorialContent,
  WarningNote,
} from '@/examples/shared'

/**
 * Chapter 4: Modern Async/Await Syntax
 * Complete tutorial content covering async/await patterns in React
 */
function Chapter04Content() {
  return (
    <TutorialContent>
      <h1>Modern Async/Await Syntax</h1>

      <LearningObjective>
        By the end of this chapter, you will understand:
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li>How to convert Promise chains to async/await syntax</li>
          <li>When to use async/await vs Promises in React</li>
          <li>How to handle async operations in React event handlers</li>
          <li>Advanced try/catch patterns for error handling</li>
          <li>Common pitfalls and best practices with async/await</li>
          <li>Performance considerations in React components</li>
        </ul>
      </LearningObjective>

      <h2>Introduction to Async/Await</h2>

      <p>
        The <code>async/await</code> syntax, introduced in ES2017, provides a
        more readable and intuitive way to work with asynchronous operations.
        It's built on top of Promises and makes asynchronous code look and
        behave more like synchronous code.
      </p>

      <ImportantNote>
        <code>async/await</code> is syntactic sugar over Promises. Under the
        hood, it still uses Promises, but provides a cleaner, more readable
        syntax that's easier to debug and maintain.
      </ImportantNote>

      <h3>Converting from .then() to async/await</h3>

      <p>
        Let's see how Promise chains can be transformed into cleaner async/await
        syntax:
      </p>

      <CodeSyntaxHighlighter language='javascript'>
        {`// Promise chain approach
function fetchUserData(userId) {
  return fetch(\`/api/users/\${userId}\`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }
      return response.json()
    })
    .then(user => {
      console.log('User loaded:', user)
      return user
    })
    .catch(error => {
      console.error('Error:', error)
      throw error
    })
}

// Async/await approach - much cleaner!
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }
    
    const user = await response.json()
    console.log('User loaded:', user)
    return user
    
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}`}
      </CodeSyntaxHighlighter>

      <SuccessNote>
        The async/await version is more linear and easier to read, especially
        for complex operations with multiple steps. It also makes debugging
        easier with clearer stack traces.
      </SuccessNote>

      <AsyncToAwaitConversionDemo />

      <h2>Async Functions in React</h2>

      <p>
        In React applications, async/await is particularly useful for handling
        data fetching, form submissions, and other asynchronous operations.
        However, there are some React-specific considerations to keep in mind.
      </p>

      <h3>Async Event Handlers</h3>

      <p>
        Event handlers in React can be async functions, making it easy to handle
        user interactions that require asynchronous operations:
      </p>

      <CodeSyntaxHighlighter language='typescript'>
        {`function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Async event handler for user actions
  const handleRefreshUser = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const userData = await fetchUserData(userId)
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // Async form submission
  const handleUpdateProfile = async (formData: FormData) => {
    setLoading(true)
    
    try {
      const updatedUser = await updateUserProfile(userId, formData)
      setUser(updatedUser)
      // Show success message
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user && (
        <div>
          <h2>{user.name}</h2>
          <button onClick={handleRefreshUser}>
            Refresh
          </button>
        </div>
      )}
    </div>
  )
}`}
      </CodeSyntaxHighlighter>

      <AsyncEventHandlersDemo />

      <h3>Async Functions in useEffect</h3>

      <WarningNote>
        <strong>Important:</strong> You cannot make the useEffect callback
        itself async. Instead, define an async function inside useEffect and
        call it.
      </WarningNote>

      <CodeSyntaxHighlighter language='typescript'>
        {`// ❌ Wrong - useEffect callback cannot be async
useEffect(async () => {
  const data = await fetchData()
  setData(data)
}, [])

// ✅ Correct - define async function inside useEffect
useEffect(() => {
  const loadData = async () => {
    try {
      const data = await fetchData()
      setData(data)
    } catch (error) {
      setError(error.message)
    }
  }
  
  loadData()
}, [])

// ✅ Alternative - using IIFE (Immediately Invoked Function Expression)
useEffect(() => {
  (async () => {
    try {
      const data = await fetchData()
      setData(data)
    } catch (error) {
      setError(error.message)
    }
  })()
}, [])`}
      </CodeSyntaxHighlighter>

      <AsyncAwaitBasicsDemo />

      <h2>Advanced Try/Catch Patterns</h2>

      <p>
        With async/await, error handling becomes more intuitive using try/catch
        blocks. However, there are advanced patterns that can help you handle
        complex scenarios more effectively.
      </p>

      <h3>Granular Error Handling</h3>

      <p>
        You can use multiple try/catch blocks to handle different types of
        errors at different levels of your async function:
      </p>

      <CodeSyntaxHighlighter language='typescript'>
        {`async function processUserRegistration(userData: UserData) {
  let user: User
  
  // Step 1: Validate user data
  try {
    await validateUserData(userData)
  } catch (validationError) {
    throw new Error(\`Validation failed: \${validationError.message}\`)
  }
  
  // Step 2: Create user account
  try {
    user = await createUserAccount(userData)
  } catch (accountError) {
    // Log specific account creation errors
    console.error('Account creation failed:', accountError)
    throw new Error('Unable to create account. Please try again.')
  }
  
  // Step 3: Send welcome email (non-critical)
  try {
    await sendWelcomeEmail(user.email)
  } catch (emailError) {
    // Don't fail the whole process for email errors
    console.warn('Welcome email failed:', emailError)
    // Continue without throwing
  }
  
  // Step 4: Set up user preferences
  try {
    await setupDefaultPreferences(user.id)
    return user
  } catch (preferencesError) {
    // User was created, but preferences failed
    console.error('Preferences setup failed:', preferencesError)
    // Return user anyway since account was created successfully
    return user
  }
}`}
      </CodeSyntaxHighlighter>

      <h3>Error Recovery and Retry Patterns</h3>

      <CodeSyntaxHighlighter language='typescript'>
        {`async function fetchWithRetry<T>(
  fetchFunction: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetchFunction()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      if (attempt === maxRetries) {
        break // Don't wait after the last attempt
      }
      
      console.warn(\`Attempt \${attempt} failed, retrying in \${delay}ms...\`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw new Error(\`Failed after \${maxRetries} attempts: \${lastError.message}\`)
}

// Usage in React component
const handleDataFetch = async () => {
  try {
    const data = await fetchWithRetry(() => fetchUserData(userId), 3, 1500)
    setData(data)
  } catch (error) {
    setError('Unable to load data after multiple attempts')
  }
}`}
      </CodeSyntaxHighlighter>

      <TryCatchPatternsDemo />

      <h2>Best Practices and Common Pitfalls</h2>

      <h3>✅ Do's</h3>
      <ul>
        <li>Use async/await for complex operations with multiple steps</li>
        <li>Always handle errors with try/catch blocks</li>
        <li>Use Promise.all() for independent parallel operations</li>
        <li>Clean up resources in finally blocks</li>
        <li>Provide meaningful error messages to users</li>
      </ul>

      <h3>❌ Don'ts</h3>
      <ul>
        <li>Don't make useEffect callback functions async</li>
        <li>Don't forget to handle promise rejections</li>
        <li>Don't use async/await for simple single operations</li>
        <li>Don't block the UI with long-running async operations</li>
        <li>Don't ignore cleanup and cancellation</li>
      </ul>

      <ImportantNote>
        Remember that async/await doesn't magically make your code faster - it's
        about readability and maintainability. For parallel operations, you
        still need Promise.all() or similar utilities.
      </ImportantNote>

      <h2>Performance Considerations</h2>

      <p>
        While async/await makes code more readable, it's important to understand
        the performance implications:
      </p>

      <CodeSyntaxHighlighter language='typescript'>
        {`// ❌ Sequential execution - slower
async function loadUserDashboard(userId: string) {
  const user = await fetchUser(userId)           // Wait 500ms
  const posts = await fetchUserPosts(userId)     // Wait another 300ms  
  const friends = await fetchUserFriends(userId) // Wait another 200ms
  
  return { user, posts, friends }
  // Total time: ~1000ms
}

// ✅ Parallel execution - faster
async function loadUserDashboard(userId: string) {
  const [user, posts, friends] = await Promise.all([
    fetchUser(userId),           // All execute simultaneously
    fetchUserPosts(userId),      // 
    fetchUserFriends(userId)     // 
  ])
  
  return { user, posts, friends }
  // Total time: ~500ms (the slowest operation)
}`}
      </CodeSyntaxHighlighter>

      <SuccessNote>
        You've completed Chapter 4! You now understand how to use modern
        async/await syntax effectively in React applications. In the next
        chapter, we'll explore advanced Promise patterns like Promise.all(),
        Promise.race(), and performance optimization techniques.
      </SuccessNote>
    </TutorialContent>
  )
}

export default Chapter04Content
