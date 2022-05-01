import React from 'react'

import GlobalStyle from '../../../styles/global'
import { Container } from './styles'

const AuthLayout: React.FC = ({ children }) => {
  return (
    <Container>
      {children}
      <GlobalStyle />
    </Container>
  )
}

export default AuthLayout
