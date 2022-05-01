import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import AppProvider from './providers'
import Routes from './routes'

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
