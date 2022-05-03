import React from 'react'
import { Navigate, RouteProps } from 'react-router-dom'

import { Loading } from '../components'
import { AuthLayout, DefaultLayout } from '../layouts'
import { useAuth, useLoading } from '../providers'

interface Props extends RouteProps {
  isPrivate?: boolean
  isPublic?: boolean
  need?: string[]
  children: JSX.Element
}

export const RouteWrapper: React.FC<Props> = ({
  children,
  need,
  isPrivate = false,
  isPublic = false
}) => {
  const { user, is } = useAuth()
  const { isLoading } = useLoading()

  if (!user && isPrivate && !isPublic) {
    return <Navigate to="/login" />
  }

  if (!!user && !isPrivate && !isPublic) {
    return <Navigate to="/dashboard" />
  }

  const Layout = user && !isPublic ? DefaultLayout : AuthLayout

  if (!children || !is(need)) {
    return <Navigate to="/dashboard" />
  }

  return (
    <Layout>
      {children}
      {isLoading && <Loading />}
    </Layout>
  )
}
