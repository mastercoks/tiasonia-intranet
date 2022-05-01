import React from 'react'

import theme from '../../styles/theme'
import Spinner from '../Spinner'
import { ButtonProps, Container } from './styles'

const Button: React.FC<ButtonProps> = ({ loading, children, ...rest }) => {
  return (
    <Container {...rest} loading={loading}>
      {loading ? (
        <>
          <Spinner color={theme.colors.primaryContrast} size={24} />
          <span>Carregando</span>
        </>
      ) : (
        children
      )}
    </Container>
  )
}

export default Button
