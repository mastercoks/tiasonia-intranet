import { Card } from '../Card'
import { Container, CloseArea, ModalContainer } from './styles'

interface Props {
  open: boolean
  onClose: () => void
  size?: 'sm' | 'md'
  children?: React.ReactNode
}

export const Modal: React.FC<Props> = ({
  open,
  onClose,
  children,
  size = 'sm'
}) => {
  const className = open ? 'show' : ''
  return (
    <Container className={`${className}`}>
      <CloseArea onClick={onClose} />
      <ModalContainer size={size}>
        <Card>{children}</Card>
      </ModalContainer>
    </Container>
  )
}
