import { transparentize } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  background-color: ${props => transparentize(0.6, props.theme.colors.dark)};
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999999;
`
