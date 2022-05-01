import Card from '../Card'
import { Container, CloseArea, ModalContainer } from './styles'

interface ModalProps {
  open: boolean
  onClose: () => void
  size?: 'sm' | 'md'
}

const Modal: React.FC<ModalProps> = ({
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

export default Modal
