import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import {
  BiChevronDown,
  BiChevronUp,
  BiCog,
  BiHomeAlt,
  BiServer
} from 'react-icons/bi'
import { NavLink } from 'react-router-dom'

import logo from '../../assets/logo.png'
import { useAuth } from '../../providers/auth'
import { Container, Nav, LogoArea, ItemContainer, SubItems } from './styles'

export interface SidebarHandles {
  toggleSidebar: () => void
}

interface Props {
  children?: ReactNode
}

export const Sidebar = forwardRef<SidebarHandles, Props>((props, ref) => {
  const { is } = useAuth()

  const [isActive, setIsActive] = useState(false)
  const [menus, setMenus] = useState([
    {
      name: 'Inicio',
      icon: <BiHomeAlt size={24} />,
      active: true,
      page: '/dashboard'
    },
    {
      name: 'Conflitos de Cadastro',
      icon: <BiServer size={24} />,
      active: false,
      page: '/conflicts',
      need: ['CONFLICT']
    },
    {
      name: 'Configurações',
      icon: <BiCog size={24} />,
      active: false,
      page: '/settings',
      need: ['SETTINGS'],
      items: [
        {
          name: 'Usuários',
          subpage: '/users',
          need: ['LIST_USER']
        },
        {
          name: 'Grupos',
          subpage: '/roles',
          need: ['LIST_ROLE']
        },
        {
          name: 'Permissões',
          subpage: '/permissions',
          need: ['LIST_PERMISSION']
        }
      ]
    }
  ])

  const toggleSidebar = useCallback(() => {
    setIsActive(state => !state)
  }, [])

  useImperativeHandle(ref, () => {
    return {
      toggleSidebar
    }
  })

  const handleToggleSubItens = useCallback((key: number) => {
    setMenus(menus =>
      menus.map((menu, index) => {
        menu.active = index === key ? !menu.active : false
        return menu
      })
    )
  }, [])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 769) {
        setIsActive(false)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const className = isActive ? 'active' : ''

  return (
    <Container className={className}>
      <LogoArea>
        <a href="/">
          <img src={logo} alt="Tia Sônia Intranet" />
        </a>
      </LogoArea>
      <Nav>
        {menus.map(
          ({ name, icon, page, items, need, active }, itemKey) =>
            is(need) && (
              <ItemContainer key={itemKey}>
                <div onClick={() => handleToggleSubItens(itemKey)}>
                  <NavLink to={page} onClick={toggleSidebar}>
                    {icon}
                    <span>{name}</span>
                    {items &&
                      (active ? (
                        <BiChevronUp size={24} />
                      ) : (
                        <BiChevronDown size={24} />
                      ))}
                  </NavLink>
                </div>
                <SubItems>
                  {active &&
                    items?.map(
                      ({ name, subpage, need }, key) =>
                        is(need) && (
                          <NavLink
                            key={key}
                            to={page + subpage}
                            onClick={toggleSidebar}
                          >
                            <span>{name}</span>
                          </NavLink>
                        )
                    )}
                </SubItems>
              </ItemContainer>
            )
        )}
      </Nav>
    </Container>
  )
})
