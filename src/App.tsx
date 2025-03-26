import React, { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes'
import Loading from './components/Loading'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
