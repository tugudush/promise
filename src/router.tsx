import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import ChapterPage from '@/pages/ChapterPage'
import HomePage from '@/pages/HomePage'

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
