import { shade, tint } from 'polished'
import styled from 'styled-components'

export const Box = styled.div`
  padding: 25px 25px 30px;
  border-radius: 20px;
  background-color: ${props => tint(1, props.theme.colors.light)};
  box-shadow: inset 0px 0px 0px 1px
    ${props => shade(0.1, props.theme.colors.light)};
`
