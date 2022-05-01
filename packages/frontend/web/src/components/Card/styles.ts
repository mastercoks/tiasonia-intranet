import { shade, tint } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  background-color: ${props => tint(1, props.theme.colors.light)};
  border-radius: 20px;
  box-shadow: inset 0px 0px 0px 1px
    ${props => shade(0.1, props.theme.colors.light)};
  > header {
    border-bottom: 2px solid ${props => shade(0.1, props.theme.colors.light)};
    padding: 25px 30px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    h2 {
      flex: 1;
      font-size: 1.25rem;
    }
    button {
      margin-left: 20px;
    }
    @media (max-width: ${props => props.theme.responsive.mdDown}) {
      h2 {
        margin-bottom: ${props => props.theme.margins.sm};
      }
      button {
        width: 100%;
        margin-bottom: ${props => props.theme.margins.sm};
        margin-left: 0;
      }
      form {
        width: 100%;
        margin-bottom: ${props => props.theme.margins.sm};
        > div > *:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
`
