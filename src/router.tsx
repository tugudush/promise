import { lazy } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/pages/homePage'))
const ChapterPage = lazy(() => import('@/pages/chapterPage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/chapter/:chapterId',
    element: <ChapterPage />,
  },
])

function AppRouter() {
  return <RouterProvider router={router} />
}

export default AppRouter
