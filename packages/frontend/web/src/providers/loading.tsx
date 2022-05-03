import { createContext, useCallback, useContext, useState } from 'react'

interface LoadingContextData {
  isLoading: boolean
  loadStart: () => void
  loadFinish: () => void
}

const LoadingContext = createContext({} as LoadingContextData)

interface Props {
  children?: React.ReactNode
}

export const LoadingProvider: React.FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)

  const loadStart = useCallback(() => setIsLoading(true), [])
  const loadFinish = useCallback(() => setIsLoading(false), [])

  return (
    <LoadingContext.Provider value={{ isLoading, loadStart, loadFinish }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = (): LoadingContextData => {
  const context = useContext(LoadingContext)

  if (!context) {
    throw new Error('useLoading must be used within an LoadingProvider')
  }

  return context
}
