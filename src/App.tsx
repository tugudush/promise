import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import './App.css'
import ChapterPage from './pages/ChapterPage'
import HomePage from './pages/HomePage'

function App() {
  return (
    <Router>
      <div className='app'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/chapter/:chapterId' element={<ChapterPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
