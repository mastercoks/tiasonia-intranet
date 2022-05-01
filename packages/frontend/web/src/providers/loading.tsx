import { createContext, useCallback, useContext, useState } from 'react'

interface LoadingContextData {
  isLoading: boolean
  loadStart: () => void
  loadFinish: () => void
}

const LoadingContext = createContext({} as LoadingContextData)

const LoadingProvider: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)

  const loadStart = useCallback(() => setIsLoading(true), [])
  const loadFinish = useCallback(() => setIsLoading(false), [])

  return (
    <LoadingContext.Provider value={{ isLoading, loadStart, loadFinish }}>
      {children}
    </LoadingContext.Provider>
  )
}

const useLoading = (): LoadingContextData => {
  const context = useContext(LoadingContext)

  if (!context) {
    throw new Error('useLoading must be used within an LoadingProvider')
  }

  return context
}

export { LoadingProvider, useLoading }
