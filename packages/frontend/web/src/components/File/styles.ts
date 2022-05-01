import { shade, tint } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  padding: 12px 16px;
  color: ${props => props.theme.colors.dark};
  background-color: ${props => tint(1, props.theme.colors.light)};
  border: 1px solid ${props => shade(0.1, props.theme.colors.light)};
  border-radius: 10px;
  margin-bottom: 12px;
  display: flex;
  :hover {
    border-color: ${props => shade(0.3, props.theme.colors.light)};
  }
  > div {
    flex: 1;
    margin: 0 12px;
    display: flex;
    flex-direction: column;
    > span + span {
      font-size: 0.875rem;
      color: ${props => shade(0.1, props.theme.colors.medium)};
    }
  }
`
