import React from 'react'
import { ThemeProvider } from 'styled-components'

import theme from '../styles/theme'
import { AuthProvider } from './auth'
import { LoadingProvider } from './loading'
import { ToastProvider } from './toast'

const AppProvider: React.FC = ({ children }) => (
  <LoadingProvider>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </LoadingProvider>
)

export default AppProvider
