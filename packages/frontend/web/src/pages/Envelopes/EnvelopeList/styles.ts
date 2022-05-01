import SimpleBar from 'simplebar-react'
import styled from 'styled-components'
import 'simplebar/dist/simplebar.min.css'

export const Container = styled.div`
  padding: 25px 20px;
`

export const ScrollArea = styled(SimpleBar)`
  max-height: calc(100vh - 232px);
  flex: 1;
  padding: 0 20px;
`

export const Buttons = styled.div`
  margin: 0 20px;
`

export const TableRow = styled.div`
  margin: 0 20px;
`
