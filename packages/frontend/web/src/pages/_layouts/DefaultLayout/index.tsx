import React, { useRef } from 'react'
import SimpleBar from 'simplebar-react'

import AppBar from '../../../components/AppBar'
import Sidebar, { SidebarHandles } from '../../../components/Sidebar'
import GlobalStyle from '../../../styles/global'
import { Container } from './styles'

import 'simplebar/dist/simplebar.min.css'

const DefaultLayout: React.FC = ({ children }) => {
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

export default DefaultLayout
