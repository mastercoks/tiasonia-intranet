import React from 'react'
import {
  Redirect,
  Route,
  RouteProps,
  RouteComponentProps
} from 'react-router-dom'

import Loading from '../components/Loading'
import AuthLayout from '../pages/_layouts/AuthLayout'
import DefaultLayout from '../pages/_layouts/DefaultLayout'
import { useAuth } from '../providers/auth'
import { useLoading } from '../providers/loading'

interface Props extends RouteProps {
  isPrivate?: boolean
  isPublic?: boolean
  need?: string[]
}

const RouteWrapper: React.FC<Props> = ({
  component: Component,
  need,
  isPrivate = false,
  isPublic = false,
  ...rest
}) => {
  const { user, is } = useAuth()
  const { isLoading } = useLoading()

  if (!user && isPrivate && !isPublic) {
    return <Redirect to="/login" />
  }

  if (!!user && !isPrivate && !isPublic) {
    return <Redirect to="/dashboard" />
  }

  const Layout = user && !isPublic ? DefaultLayout : AuthLayout

  if (!Component || !is(need)) {
    return <Redirect to="/dashboard" />
  }

  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps<any>) => (
        <>
          <Layout>
            <Component {...props} />
            {isLoading && <Loading />}
          </Layout>
        </>
      )}
    />
  )
}

export default RouteWrapper
