import React from 'react'

import { useAuth } from '../../providers'
import { capitalize } from '../../utils'
import { Container } from './styles'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  return (
    <Container>
      <h2>Olá {capitalize(user.name)},</h2>
      <h1>Bem vindo de volta👋</h1>
    </Container>
  )
}
