import React from 'react'
import { Routes as RoutesDom, Route, Navigate } from 'react-router-dom'

import {
  ConflictList,
  Dashboard,
  SignIn,
  PermissionList,
  RoleList,
  UserList
} from '../pages'
import { AuthProvider } from '../providers'
import { RouteWrapper } from './Route'

export const Routes: React.FC = () => {
  return (
    <AuthProvider>
      <RoutesDom>
        <Route
          path="/login"
          element={
            <RouteWrapper>
              <SignIn />
            </RouteWrapper>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RouteWrapper isPrivate>
              <Dashboard />
            </RouteWrapper>
          }
        />
        <Route
          path="/*"
          element={
            <RouteWrapper isPrivate>
              <Dashboard />
            </RouteWrapper>
          }
        />
        <Route
          path="/conflicts"
          element={
            <RouteWrapper isPrivate need={['LIST_CONFLICT']}>
              <ConflictList />
            </RouteWrapper>
          }
        />
        <Route
          path="/settings"
          element={
            <RouteWrapper isPrivate need={['SETTINGS']}>
              <Dashboard />
            </RouteWrapper>
          }
        />
        <Route
          path="/settings/users"
          element={
            <RouteWrapper isPrivate need={['LIST_USER']}>
              <UserList />
            </RouteWrapper>
          }
        />
        <Route
          path="/settings/roles"
          element={
            <RouteWrapper isPrivate need={['LIST_ROLE']}>
              <RoleList />
            </RouteWrapper>
          }
        />
        <Route
          path="/settings/permissions"
          element={
            <RouteWrapper isPrivate need={['LIST_PERMISSION']}>
              <PermissionList />
            </RouteWrapper>
          }
        />
      </RoutesDom>
    </AuthProvider>
  )
}
