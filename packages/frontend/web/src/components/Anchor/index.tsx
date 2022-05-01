import React from 'react'

import { AnchorProps, Container } from './styles'

const Anchor: React.FC<AnchorProps> = ({ children, ...rest }) => {
  return <Container {...rest}>{children}</Container>
}

export default Anchor
