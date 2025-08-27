import { Suspense } from 'react'

import { ErrorBoundary, LoadingSpinner } from '@/components'
import AppRouter from '@/router'

import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <div className='app'>
        <Suspense fallback={<LoadingSpinner message="Loading tutorial..." />}>
          <AppRouter />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default App
