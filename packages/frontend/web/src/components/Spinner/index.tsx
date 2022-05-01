import React from 'react'

import { SpinnerContainer, Bounce1, Bounce2 } from './styles'

interface Props {
  color?: string
  size?: number
}

const Spinner: React.FC<Props> = ({ color, size = 25 }) => {
  return (
    <SpinnerContainer size={size}>
      <Bounce1 color={color} />
      <Bounce2 color={color} />
    </SpinnerContainer>
  )
}

export default Spinner
