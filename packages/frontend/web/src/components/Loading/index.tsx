import theme from '../../styles/theme'
import Spinner from '../Spinner'
import { Container } from './styles'

const Loading: React.FC = () => {
  return (
    <Container>
      <Spinner size={100} color={theme.colors.dark} />
    </Container>
  )
}

export default Loading
