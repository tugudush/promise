import { Link, useParams } from 'react-router-dom'

import './ChapterPage.css'

function ChapterPage() {
  const { chapterId } = useParams()

  // Chapter data mapping
  const chapters = {
    '1': {
      title: 'Foundations of Asynchronous JavaScript',
      description:
        'Understanding the Event Loop, Promises, and basic async patterns',
      duration: '45 minutes',
      difficulty: 'Beginner',
    },
    '2': {
      title: 'Promise Patterns in React',
      description: 'useEffect, loading states, and error boundaries',
      duration: '60 minutes',
      difficulty: 'Beginner',
    },
    '3': {
      title: 'Modern Async/Await Syntax',
      description: 'Converting to async/await and error handling',
      duration: '50 minutes',
      difficulty: 'Intermediate',
    },
    '4': {
      title: 'Advanced Promise Patterns',
      description:
        'Promise.all(), Promise.race(), and performance optimization',
      duration: '75 minutes',
      difficulty: 'Intermediate',
    },
    '5': {
      title: 'React Hooks and Async Patterns',
      description: 'Custom hooks, useAsync, and complex async flows',
      duration: '90 minutes',
      difficulty: 'Intermediate',
    },
    '6': {
      title: 'State Management with Async Operations',
      description: 'Context API, optimistic updates, and state libraries',
      duration: '60 minutes',
      difficulty: 'Advanced',
    },
    '7': {
      title: 'Real-World React Applications',
      description: 'API integration, file operations, and background tasks',
      duration: '120 minutes',
      difficulty: 'Advanced',
    },
    '8': {
      title: 'Testing Async Code in React',
      description: 'Testing async components and integration testing',
      duration: '45 minutes',
      difficulty: 'Intermediate',
    },
    '9': {
      title: 'Performance and Best Practices',
      description: 'Optimization, pitfalls, and code review guidelines',
      duration: '40 minutes',
      difficulty: 'Advanced',
    },
    '10': {
      title: 'Capstone Project',
      description: 'Build a complete React application with async patterns',
      duration: '180 minutes',
      difficulty: 'Advanced',
    },
  }

  const chapter = chapters[chapterId as keyof typeof chapters]

  if (!chapter) {
    return (
      <div className='chapter-page'>
        <div className='chapter-not-found'>
          <h1>Chapter Not Found</h1>
          <p>The requested chapter does not exist.</p>
          <Link to='/' className='back-home'>
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='chapter-page'>
      <nav className='chapter-nav'>
        <Link to='/' className='nav-link'>
          ← Back to Contents
        </Link>
        <div className='chapter-progress'>Chapter {chapterId} of 10</div>
      </nav>

      <header className='chapter-header'>
        <div className='chapter-meta'>
          <span className='chapter-number'>Chapter {chapterId}</span>
          <div className='chapter-badges'>
            <span
              className={`difficulty-badge ${chapter.difficulty.toLowerCase()}`}
            >
              {chapter.difficulty}
            </span>
            <span className='duration-badge'>{chapter.duration}</span>
          </div>
        </div>
        <h1>{chapter.title}</h1>
        <p className='chapter-description'>{chapter.description}</p>
      </header>

      <main className='chapter-content'>
        <div className='coming-soon'>
          <h2>🚧 Content Coming Soon</h2>
          <p>
            This chapter is currently under development. The tutorial content
            will include:
          </p>
          <ul>
            <li>Interactive code examples</li>
            <li>Step-by-step explanations</li>
            <li>Hands-on exercises</li>
            <li>Real-world React patterns</li>
          </ul>
          <p>Check back soon for the complete tutorial content!</p>
        </div>
      </main>

      <nav className='chapter-navigation'>
        {parseInt(chapterId || '1') > 1 && (
          <Link
            to={`/chapter/${parseInt(chapterId || '1') - 1}`}
            className='nav-button prev'
          >
            ← Previous Chapter
          </Link>
        )}

        {parseInt(chapterId || '1') < 10 && (
          <Link
            to={`/chapter/${parseInt(chapterId || '1') + 1}`}
            className='nav-button next'
          >
            Next Chapter →
          </Link>
        )}
      </nav>
    </div>
  )
}

export default ChapterPage
