import React from 'react'

import { GlobalStyle } from '../../styles'
import { Container } from './styles'

interface Props {
  children?: React.ReactNode
}

export const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <Container>
      {children}
      <GlobalStyle />
    </Container>
  )
}
