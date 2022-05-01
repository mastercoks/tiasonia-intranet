import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from 'react'

import { useOnClickOutside } from '../../providers/hooks'
import { Container } from './styles'

export interface DropdownHandles {
  handleShowMenu: () => void
}

interface Props {
  space?: number
  children: ReactNode
}

const Dropdown: React.ForwardRefRenderFunction<DropdownHandles, Props> = (
  { space, children },
  ref
) => {
  const refMenu = useRef(null)
  const [showMenu, setShowMenu] = useState(false)
  useOnClickOutside(refMenu, () => setShowMenu(false))

  const handleShowMenu = useCallback(() => {
    const newState = !showMenu
    setShowMenu(newState)
  }, [showMenu])

  useImperativeHandle(ref, () => {
    return {
      handleShowMenu
    }
  })

  if (!showMenu) return null

  return (
    <Container ref={refMenu} space={space}>
      {children}
    </Container>
  )
}

export default forwardRef(Dropdown)
