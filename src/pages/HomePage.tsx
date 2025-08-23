import { Link } from 'react-router-dom'

import './HomePage.css'

function HomePage() {
  return (
    <div className='home-page'>
      <header className='hero'>
        <h1>Promise</h1>
        <p className='hero-subtitle'>
          Master JavaScript Async Programming in React
        </p>
        <p className='hero-description'>
          An interactive tutorial covering async/await, Promises, and
          asynchronous patterns specifically designed for React developers.
        </p>
      </header>

      <section className='overview'>
        <h2>What You'll Learn</h2>
        <div className='learning-grid'>
          <div className='learning-card'>
            <h3>🔗 Promise Fundamentals</h3>
            <p>
              Understanding async operations, Promise states, and basic patterns
            </p>
          </div>
          <div className='learning-card'>
            <h3>⚡ Async/Await Syntax</h3>
            <p>Modern asynchronous programming with clean, readable code</p>
          </div>
          <div className='learning-card'>
            <h3>⚛️ React Integration</h3>
            <p>Handling async operations in React components and hooks</p>
          </div>
          <div className='learning-card'>
            <h3>🛠️ Custom Hooks</h3>
            <p>
              Building reusable async logic with useFetch and useAsync patterns
            </p>
          </div>
          <div className='learning-card'>
            <h3>🛡️ Error Handling</h3>
            <p>Graceful error management in async React applications</p>
          </div>
          <div className='learning-card'>
            <h3>🚀 Performance</h3>
            <p>Optimization techniques for better user experience</p>
          </div>
        </div>
      </section>

      <section className='table-of-contents'>
        <h2>Tutorial Chapters</h2>
        <div className='chapters-grid'>
          <div className='chapter-group'>
            <h3>Foundation (Beginner)</h3>
            <div className='chapters'>
              <Link to='/chapter/1' className='chapter-link'>
                <span className='chapter-number'>01</span>
                <div>
                  <h4>Foundations of Asynchronous JavaScript</h4>
                  <p>Event loop, Promises, and basic async patterns</p>
                  <span className='duration'>45 min</span>
                </div>
              </Link>
              <Link to='/chapter/2' className='chapter-link'>
                <span className='chapter-number'>02</span>
                <div>
                  <h4>Promise Patterns in React</h4>
                  <p>useEffect, loading states, and error boundaries</p>
                  <span className='duration'>60 min</span>
                </div>
              </Link>
              <Link to='/chapter/3' className='chapter-link'>
                <span className='chapter-number'>03</span>
                <div>
                  <h4>Modern Async/Await Syntax</h4>
                  <p>Converting to async/await and error handling</p>
                  <span className='duration'>50 min</span>
                </div>
              </Link>
            </div>
          </div>

          <div className='chapter-group'>
            <h3>Advanced Patterns (Intermediate)</h3>
            <div className='chapters'>
              <Link to='/chapter/4' className='chapter-link'>
                <span className='chapter-number'>04</span>
                <div>
                  <h4>Advanced Promise Patterns</h4>
                  <p>
                    Promise.all(), Promise.race(), and performance optimization
                  </p>
                  <span className='duration'>75 min</span>
                </div>
              </Link>
              <Link to='/chapter/5' className='chapter-link'>
                <span className='chapter-number'>05</span>
                <div>
                  <h4>React Hooks and Async Patterns</h4>
                  <p>Custom hooks, useAsync, and complex async flows</p>
                  <span className='duration'>90 min</span>
                </div>
              </Link>
              <Link to='/chapter/6' className='chapter-link'>
                <span className='chapter-number'>06</span>
                <div>
                  <h4>State Management with Async Operations</h4>
                  <p>Context API, optimistic updates, and state libraries</p>
                  <span className='duration'>60 min</span>
                </div>
              </Link>
            </div>
          </div>

          <div className='chapter-group'>
            <h3>Real-World Applications (Advanced)</h3>
            <div className='chapters'>
              <Link to='/chapter/7' className='chapter-link'>
                <span className='chapter-number'>07</span>
                <div>
                  <h4>Real-World React Applications</h4>
                  <p>API integration, file operations, and background tasks</p>
                  <span className='duration'>120 min</span>
                </div>
              </Link>
              <Link to='/chapter/8' className='chapter-link'>
                <span className='chapter-number'>08</span>
                <div>
                  <h4>Testing Async Code in React</h4>
                  <p>Testing async components and integration testing</p>
                  <span className='duration'>45 min</span>
                </div>
              </Link>
              <Link to='/chapter/9' className='chapter-link'>
                <span className='chapter-number'>09</span>
                <div>
                  <h4>Performance and Best Practices</h4>
                  <p>Optimization, pitfalls, and code review guidelines</p>
                  <span className='duration'>40 min</span>
                </div>
              </Link>
              <Link to='/chapter/10' className='chapter-link'>
                <span className='chapter-number'>10</span>
                <div>
                  <h4>Capstone Project</h4>
                  <p>Build a complete React application with async patterns</p>
                  <span className='duration'>180 min</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className='getting-started'>
        <h2>Ready to Start?</h2>
        <p>
          Begin with the fundamentals and work your way up to advanced patterns.
          Each chapter builds upon the previous one with hands-on examples and
          real-world applications.
        </p>
        <Link to='/chapter/1' className='start-button'>
          Start Chapter 1: Foundations
        </Link>
      </section>
    </div>
  )
}

export default HomePage
