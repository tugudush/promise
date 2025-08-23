import {
  CallbackVsPromiseDemo,
  ErrorHandlingDemo,
  PromiseBasicsDemo,
} from '@/examples/chapter01'
import {
  CodeSyntaxHighlighter,
  ImportantNote,
  LearningObjective,
  SuccessNote,
  TutorialContent,
} from '@/examples/shared'

/**
 * Chapter 1: Foundations of Asynchronous JavaScript
 * Complete tutorial content with interactive examples and explanations
 */
function Chapter01Content() {
  return (
    <TutorialContent>
      <h1>Foundations of Asynchronous JavaScript</h1>

      <LearningObjective>
        By the end of this chapter, you will understand:
        <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
          <li>What asynchronous programming is and why it's important</li>
          <li>How the JavaScript Event Loop works</li>
          <li>The evolution from callbacks to Promises</li>
          <li>How to create and use basic Promises</li>
          <li>Promise states: pending, fulfilled, and rejected</li>
          <li>Basic error handling with Promises</li>
        </ul>
      </LearningObjective>

      <h2>What is Asynchronous Programming?</h2>

      <p>
        Asynchronous programming allows your code to perform long-running tasks
        without blocking the main thread. In JavaScript, operations like network
        requests, file operations, and timers are asynchronous by nature.
      </p>

      <ImportantNote>
        JavaScript is single-threaded, meaning it can only execute one operation
        at a time. Asynchronous programming allows us to handle multiple
        operations efficiently without freezing the user interface.
      </ImportantNote>

      <h3>Synchronous vs Asynchronous</h3>

      <CodeSyntaxHighlighter language='javascript'>
        {`// ❌ Synchronous (blocking) - Don't do this for long operations
console.log('Start')
// This would freeze the browser for 3 seconds
for (let i = 0; i < 3000000000; i++) { /* heavy computation */ }
console.log('End')

// ✅ Asynchronous (non-blocking) - Much better!
console.log('Start')
setTimeout(() => {
  console.log('This runs after 3 seconds')
}, 3000)
console.log('End') // This runs immediately`}
      </CodeSyntaxHighlighter>

      <h2>The JavaScript Event Loop</h2>

      <p>
        The Event Loop is the heart of JavaScript's asynchronous behavior. It
        continuously checks if the call stack is empty and processes tasks from
        the task queue.
      </p>

      <CodeSyntaxHighlighter language='javascript'>
        {`// Understanding execution order
console.log('1: Synchronous')

setTimeout(() => {
  console.log('2: Async (timeout)')
}, 0)

Promise.resolve().then(() => {
  console.log('3: Async (Promise)')
})

console.log('4: Synchronous')

// Output: 1, 4, 3, 2
// Promises have higher priority than timeouts!`}
      </CodeSyntaxHighlighter>

      <h2>From Callbacks to Promises</h2>

      <p>
        Before Promises, JavaScript used callbacks for asynchronous operations.
        While functional, callbacks often led to deeply nested code that was
        hard to read and maintain.
      </p>

      <CallbackVsPromiseDemo />

      <h2>Understanding Promises</h2>

      <p>
        A Promise is an object representing the eventual completion or failure
        of an asynchronous operation. Promises have three states:
      </p>

      <ul>
        <li>
          <strong>Pending:</strong> The initial state, neither fulfilled nor
          rejected
        </li>
        <li>
          <strong>Fulfilled:</strong> The operation completed successfully
        </li>
        <li>
          <strong>Rejected:</strong> The operation failed
        </li>
      </ul>

      <SuccessNote>
        Once a Promise is settled (fulfilled or rejected), its state cannot
        change. This immutability makes Promises reliable and predictable.
      </SuccessNote>

      <h3>Creating and Using Promises</h3>

      <CodeSyntaxHighlighter language='javascript'>
        {`// Creating a Promise
const myPromise = new Promise((resolve, reject) => {
  // Simulate async operation
  setTimeout(() => {
    const success = Math.random() > 0.5
    
    if (success) {
      resolve('Operation successful!')
    } else {
      reject(new Error('Operation failed!'))
    }
  }, 1000)
})

// Using the Promise
myPromise
  .then(result => {
    console.log('Success:', result)
  })
  .catch(error => {
    console.error('Error:', error.message)
  })`}
      </CodeSyntaxHighlighter>

      <PromiseBasicsDemo />

      <h2>Promise Error Handling</h2>

      <p>
        Proper error handling is crucial in asynchronous programming. Promises
        provide clean ways to catch and handle errors using{' '}
        <code>.catch()</code> methods or try/catch blocks with async/await.
      </p>

      <ErrorHandlingDemo />

      <h3>Promise Method Chaining</h3>

      <p>
        One of the key advantages of Promises is their ability to chain
        operations together, creating clean, readable asynchronous code.
      </p>

      <CodeSyntaxHighlighter language='javascript'>
        {`// Promise chaining
fetchUser(userId)
  .then(user => {
    console.log('User loaded:', user.name)
    return fetchUserPosts(user.id) // Return another Promise
  })
  .then(posts => {
    console.log('Posts loaded:', posts.length)
    return formatPosts(posts) // Can return regular values too
  })
  .then(formattedPosts => {
    displayPosts(formattedPosts)
  })
  .catch(error => {
    console.error('Something went wrong:', error)
  })`}
      </CodeSyntaxHighlighter>

      <SuccessNote>
        Always end Promise chains with a .catch() to handle any errors that
        might occur at any point in the chain.
      </SuccessNote>

      <h2>Key Takeaways</h2>

      <ul>
        <li>Asynchronous programming prevents blocking the main thread</li>
        <li>The Event Loop manages asynchronous operations in JavaScript</li>
        <li>
          Promises solve "callback hell" with cleaner, more maintainable code
        </li>
        <li>Promises have three states: pending, fulfilled, and rejected</li>
        <li>Always handle errors with .catch() or try/catch blocks</li>
        <li>Promise chaining allows for sequential asynchronous operations</li>
      </ul>

      <h2>What's Next?</h2>

      <p>
        In the next chapter, we'll explore how to integrate Promises with React
        components, manage loading states, and handle asynchronous operations in
        the component lifecycle.
      </p>
    </TutorialContent>
  )
}

export default Chapter01Content
