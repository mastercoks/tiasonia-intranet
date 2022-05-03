import { Container } from './styles'

interface Props {
  children?: React.ReactNode
}

export const Card: React.FC<Props> = ({ children }) => {
  return <Container>{children}</Container>
}
