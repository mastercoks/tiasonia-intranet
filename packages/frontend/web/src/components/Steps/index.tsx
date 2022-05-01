import { ReactNode } from 'react'
import { IconType } from 'react-icons'

import { Container, Step, Content } from './styles'

interface StepProps {
  icon: IconType | string
  label?: string
  content: ReactNode
}

interface Props {
  steps: StepProps[]
}

const Steps: React.FC<Props> = ({ steps }) => {
  return (
    <Container>
      {steps.map(({ icon, label, content }, key) => (
        <Step icon={icon} key={key}>
          <Content>
            {label && <label>{label}</label>}
            {content}
          </Content>
        </Step>
      ))}
    </Container>
  )
}

export default Steps
