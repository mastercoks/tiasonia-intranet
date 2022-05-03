import React, { RefObject, useCallback, useRef } from 'react'
import { BiMenu, BiUser, BiLogOutCircle } from 'react-icons/bi'

import { useAuth } from '../../providers/auth'
import { Button } from '../Button'
import { Dropdown, DropdownHandles } from '../Dropdown'
import { SidebarHandles } from '../Sidebar'
import { Container } from './styles'

interface AppBarProps {
  sidebarRef: RefObject<SidebarHandles>
}

export const AppBar: React.FC<AppBarProps> = ({ sidebarRef }) => {
  const { signOut } = useAuth()
  const dropdownRef = useRef<DropdownHandles>(null)

  const handleDropdown = useCallback(() => {
    dropdownRef.current?.handleShowMenu()
  }, [])

  return (
    <Container>
      <a
        className="hide-md-up"
        onClick={() => sidebarRef.current?.toggleSidebar()}
      >
        <BiMenu size={24} />
      </a>
      <span>Intranet - Tia Sônia</span>
      <nav>
        <a onClick={handleDropdown} style={{ position: 'relative' }}>
          <BiUser size={24} />
          <Dropdown ref={dropdownRef} space={16}>
            <Button color="secondary" onClick={signOut}>
              <BiLogOutCircle size={24} />
              Sair
            </Button>
          </Dropdown>
        </a>
      </nav>
    </Container>
  )
}
