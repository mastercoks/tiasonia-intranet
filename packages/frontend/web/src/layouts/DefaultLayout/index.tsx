import React, { useRef } from 'react'
import SimpleBar from 'simplebar-react'

import { AppBar, Sidebar, SidebarHandles } from '../../components'
import { GlobalStyle } from '../../styles'
import { Container } from './styles'

import 'simplebar/dist/simplebar.min.css'

interface Props {
  children?: React.ReactNode
}

export const DefaultLayout: React.FC<Props> = ({ children }) => {
  const sidebarRef = useRef<SidebarHandles>(null)
  return (
    <Container>
      <Sidebar ref={sidebarRef} />
      <main>
        <AppBar sidebarRef={sidebarRef} />
        <SimpleBar
          style={{
            minHeight: 'calc(100vh - 64px)',
            maxHeight: 'calc(100vh - 64px)'
          }}
        >
          {children}
        </SimpleBar>
      </main>
      <GlobalStyle />
    </Container>
  )
}
