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
  BiEnvelope,
  BiHomeAlt,
  BiIdCard,
  BiServer,
  BiShieldQuarter
} from 'react-icons/bi'
import { NavLink } from 'react-router-dom'

import logo from '../../assets/logo.svg'
import { useAuth } from '../../providers/auth'
import { Container, Nav, LogoArea, ItemContainer, SubItems } from './styles'

export interface SidebarHandles {
  toggleSidebar: () => void
}

interface Props {
  children?: ReactNode
}

const Sidebar: React.ForwardRefRenderFunction<SidebarHandles, Props> = (
  props,
  ref
) => {
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
      name: 'Assinaturas',
      icon: <BiIdCard size={24} />,
      active: false,
      page: '/signatures',
      need: ['SIGNATURES']
    },
    {
      name: 'Envelopes',
      icon: <BiEnvelope size={24} />,
      active: false,
      page: '/envelopes',
      need: ['ENVELOPES'],
      items: [
        {
          name: 'Contatos',
          subpage: '/contacts',
          need: ['LIST_CONTACT']
        }
      ]
    },
    // {
    //   name: 'Mural Interativo',
    //   icon: <BiTable size={24} />,
    //   active: false,
    //   page: '/information-wall'
    // },
    {
      name: 'Controle Acesso',
      icon: <BiShieldQuarter size={24} />,
      active: false,
      page: '/access-control',
      need: ['ACCESS_CONTROL'],
      items: [
        {
          name: 'Colaboradores',
          subpage: '/collaborators',
          need: ['LIST_USER']
        },
        {
          name: 'Registros',
          subpage: '/records',
          need: ['LIST_RECORD']
        },
        {
          name: 'Relatórios',
          subpage: '/reports'
        }
      ]
    },
    // {
    //   name: 'Assinaturas',
    //   icon: <BiIdCard size={24} />,
    //   active: false,
    //   page: '/email-signature'
    // },
    // {
    //   name: 'Prorrogar contas',
    //   icon: <BiHistory size={24} />,
    //   active: false,
    //   page: '/reschedule-bills'
    // },
    {
      name: 'Webservices',
      icon: <BiServer size={24} />,
      active: false,
      page: '/webservices',
      need: ['WEBSERVICES'],
      items: [
        {
          name: 'Conflitos de Cadastro',
          subpage: '/conflicts',
          need: ['LIST_CONFLICT']
        }
      ]
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
        },
        {
          name: 'Leitores',
          subpage: '/readers',
          need: ['LIST_READER']
        },
        {
          name: 'Tipos de Leitor',
          subpage: '/types',
          need: ['LIST_READER']
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
          <img src={logo} alt="Teiú Intranet" />
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
}

export default forwardRef(Sidebar)
