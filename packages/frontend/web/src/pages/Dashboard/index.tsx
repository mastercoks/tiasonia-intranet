import React from 'react'

import { useAuth } from '../../providers/auth'
import capitalize from '../../utils/capitalize'
import { Container } from './styles'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  return (
    <Container>
      <h2>Olá {capitalize(user.name)},</h2>
      <h1>Bem vindo de volta👋</h1>
    </Container>
  )
}

export default Dashboard
