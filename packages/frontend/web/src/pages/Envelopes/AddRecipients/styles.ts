import { shade, tint } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  padding: 25px 20px;
`

export const Recipient = styled.div`
  padding: 12px 16px;
  color: ${props => props.theme.colors.dark};
  background-color: ${props => tint(1, props.theme.colors.light)};
  border: 1px solid ${props => shade(0.1, props.theme.colors.light)};
  border-radius: 10px;
  margin-bottom: 12px;
  display: flex;
  > div {
    flex: 1;
  }
  > * {
    margin: 0 16px;
  }
  > *:first-child,
  > *:last-child {
    margin: 0;
  }
  button {
    margin: 27px auto auto !important;
    padding: 10px;
  }
`
