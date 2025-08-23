import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { ChapterPage, HomePage } from '@/pages'

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
