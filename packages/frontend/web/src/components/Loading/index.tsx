import { theme } from '../../styles'
import { Spinner } from '../Spinner'
import { Container } from './styles'

export const Loading: React.FC = () => {
  return (
    <Container>
      <Spinner size={100} color={theme.colors.dark} />
    </Container>
  )
}
