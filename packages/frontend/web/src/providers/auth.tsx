import { decode } from 'jsonwebtoken'
import React, { createContext, useCallback, useState, useContext } from 'react'

import api from '../services/axios'

interface IContact {
  id: string
  name: string
  email: string
  confirm: string
}

interface IUser {
  id: string
  name: string
  email: string
  type: string
  cpf: string
  company: string
  contact?: IContact
}

interface AuthState {
  user: IUser
  permissions: any
  token: string
}

interface SignInCredentials {
  login: string
  password: string
}

interface AuthContextData {
  user: IUser
  is(need: string[] | undefined): boolean
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@IntranetTeiu:token')
    const payload: any = decode(token || '', { json: false })

    if (token) {
      return {
        token,
        user: payload?.user,
        permissions: payload?.permissions
      }
    }

    return {} as AuthState
  })

  const is = useCallback(
    need =>
      !need ||
      data?.permissions.some((permission: any) => need.includes(permission)),
    [data]
  )

  const signIn = useCallback(async ({ login, password }) => {
    const response = await api.post('sessions', {
      login,
      password
    })

    const { token } = response.data

    localStorage.setItem('@IntranetTeiu:token', token)
    const payload: any = decode(token || '')

    setData({ token, user: payload?.user, permissions: payload?.permissions })
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('@IntranetTeiu:token')

    setData({} as AuthState)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        is,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }
