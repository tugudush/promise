import { Suspense, lazy } from 'react'

import { useParams } from 'react-router-dom'

import { LoadingSpinner } from '@/components'

import {
  BackHome,
  ChapterBadges,
  ChapterContent,
  ChapterDescription,
  ChapterHeader,
  ChapterMeta,
  ChapterNav,
  ChapterNavigation,
  ChapterNotFound,
  ChapterNumber,
  ChapterPageContainer,
  ChapterProgress,
  ChapterTitle,
  ComingSoon,
  DifficultyBadge,
  DurationBadge,
  NavButton,
  NavLink,
} from './ChapterPage.styles'

// Lazy load chapter content components for better code splitting
const Chapter01Content = lazy(
  () => import('@/examples/chapter01/Chapter01Content')
)
const Chapter02Content = lazy(
  () => import('@/examples/chapter02/Chapter02Content')
)
const Chapter03Content = lazy(
  () => import('@/examples/chapter03/Chapter03Content')
)
const Chapter04Content = lazy(
  () => import('@/examples/chapter04/Chapter04Content')
)
const Chapter05Content = lazy(
  () => import('@/examples/chapter05/Chapter05Content')
)
const Chapter06Content = lazy(
  () => import('@/examples/chapter06/Chapter06Content')
)
const Chapter07Content = lazy(
  () => import('@/examples/chapter07/Chapter07Content')
)
const Chapter08Content = lazy(
  () => import('@/examples/chapter08/Chapter08Content')
)

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
      title: 'Mastering Error Handling in Async React',
      description:
        'Advanced error patterns, retry mechanisms, and production strategies',
      duration: '60 minutes',
      difficulty: 'Intermediate',
    },
    '4': {
      title: 'Modern Async/Await Syntax',
      description: 'Converting to async/await and error handling',
      duration: '50 minutes',
      difficulty: 'Intermediate',
    },
    '5': {
      title: 'Advanced Promise Patterns',
      description:
        'Promise.all(), Promise.race(), and performance optimization',
      duration: '75 minutes',
      difficulty: 'Intermediate',
    },
    '6': {
      title: 'React Hooks and Async Patterns',
      description: 'Custom hooks, useAsync, and complex async flows',
      duration: '90 minutes',
      difficulty: 'Advanced',
    },
    '7': {
      title: 'State Management with Async Operations',
      description: 'Context API, optimistic updates, and state libraries',
      duration: '60 minutes',
      difficulty: 'Advanced',
    },
    '8': {
      title: 'Real-World React Applications',
      description: 'API integration, file operations, and background tasks',
      duration: '120 minutes',
      difficulty: 'Advanced',
    },
    '9': {
      title: 'Testing Async Code in React',
      description: 'Testing async components and integration testing',
      duration: '45 minutes',
      difficulty: 'Intermediate',
    },
    '10': {
      title: 'Performance and Best Practices',
      description: 'Optimization, pitfalls, and code review guidelines',
      duration: '40 minutes',
      difficulty: 'Advanced',
    },
    '11': {
      title: 'Capstone Project',
      description: 'Build a complete React application with async patterns',
      duration: '180 minutes',
      difficulty: 'Advanced',
    },
  }

  const chapter = chapters[chapterId as keyof typeof chapters]

  if (!chapter) {
    return (
      <ChapterPageContainer>
        <ChapterNotFound>
          <h1>Chapter Not Found</h1>
          <p>The requested chapter does not exist.</p>
          <BackHome to='/'>← Back to Home</BackHome>
        </ChapterNotFound>
      </ChapterPageContainer>
    )
  }

  return (
    <ChapterPageContainer>
      <ChapterNav>
        <NavLink to='/'>← Back to Contents</NavLink>
        <ChapterProgress>Chapter {chapterId} of 11</ChapterProgress>
      </ChapterNav>

      <ChapterHeader>
        <ChapterMeta>
          <ChapterNumber>Chapter {chapterId}</ChapterNumber>
          <ChapterBadges>
            <DifficultyBadge difficulty={chapter.difficulty}>
              {chapter.difficulty}
            </DifficultyBadge>
            <DurationBadge>{chapter.duration}</DurationBadge>
          </ChapterBadges>
        </ChapterMeta>
        <ChapterTitle>{chapter.title}</ChapterTitle>
        <ChapterDescription>{chapter.description}</ChapterDescription>
      </ChapterHeader>

      <ChapterContent>
        <Suspense
          fallback={<LoadingSpinner message='Loading chapter content...' />}
        >
          {chapterId === '1' ? (
            <Chapter01Content />
          ) : chapterId === '2' ? (
            <Chapter02Content />
          ) : chapterId === '3' ? (
            <Chapter03Content />
          ) : chapterId === '4' ? (
            <Chapter04Content />
          ) : chapterId === '5' ? (
            <Chapter05Content />
          ) : chapterId === '6' ? (
            <Chapter06Content />
          ) : chapterId === '7' ? (
            <Chapter07Content />
          ) : chapterId === '8' ? (
            <Chapter08Content />
          ) : (
            <ComingSoon>
              <h2>🚧 Content Coming Soon</h2>
              <p>
                This chapter is currently under development. The tutorial
                content will include:
              </p>
              <ul>
                <li>Interactive code examples</li>
                <li>Step-by-step explanations</li>
                <li>Hands-on exercises</li>
                <li>Real-world React patterns</li>
              </ul>
              <p>Check back soon for the complete tutorial content!</p>
            </ComingSoon>
          )}
        </Suspense>
      </ChapterContent>

      <ChapterNavigation>
        {parseInt(chapterId || '1') > 1 && (
          <NavButton to={`/chapter/${parseInt(chapterId || '1') - 1}`}>
            ← Previous Chapter
          </NavButton>
        )}

        {parseInt(chapterId || '1') < 11 && (
          <NavButton to={`/chapter/${parseInt(chapterId || '1') + 1}`}>
            Next Chapter →
          </NavButton>
        )}
      </ChapterNavigation>
    </ChapterPageContainer>
  )
}

export default ChapterPage
