import { tint } from 'polished'
import styled from 'styled-components'

export const Content = styled.div`
  grid-area: form;
  height: 100%;
  background-color: ${props => tint(0.3, props.theme.colors.light)};
  color: ${props => props.theme.colors.lightContrast};
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  p {
    text-align: justify;
    margin-bottom: 32px;
  }
  > * {
    margin-bottom: 10px;
  }
  button {
    width: 100%;
  }
  h2 {
    margin: 32px 0;
    font-size: 20px;
  }
  @media (min-width: 426px) {
    padding: 40px;
    h2 {
      font-size: 24px;
    }
  }
  @media (min-width: 769px) {
    padding: 64px;
  }
`
