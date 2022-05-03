import React from 'react'
import { ThemeProvider } from 'styled-components'

import { theme } from '../styles'
import { AuthProvider } from './auth'
import { LoadingProvider } from './loading'
import { ToastProvider } from './toast'

interface Props {
  children?: React.ReactNode
}

export const AppProvider: React.FC<Props> = ({ children }) => (
  <LoadingProvider>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </LoadingProvider>
)

export * from './auth'
export * from './hooks'
export * from './loading'
export * from './toast'
