import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useState
} from 'react'
import { BiArrowBack } from 'react-icons/bi'

import { Button } from '../Button'
import { Container } from './styles'

export interface FilterHandles {
  toggleModal: (state: boolean) => void
}

interface Props {
  title: string
  children: ReactNode
}

export const Filters = forwardRef<FilterHandles, Props>(
  ({ title, children }, ref) => {
    const [isActive, setIsActive] = useState(false)

    const toggleModal = useCallback((state: boolean) => {
      setIsActive(state)
    }, [])

    useImperativeHandle(ref, () => {
      return {
        toggleModal
      }
    })

    const handleCloseModal = useCallback(() => {
      setIsActive(false)
    }, [])

    const className = isActive ? 'active' : ''

    return (
      <Container className={className}>
        <header>
          <Button onClick={handleCloseModal}>
            <BiArrowBack size={30} />
          </Button>
          <h1>{title}</h1>
        </header>
        {children}
      </Container>
    )
  }
)
