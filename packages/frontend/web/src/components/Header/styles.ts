import { transparentize } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  > h1 {
    font: 600 20px 'Poppins', sans-serif;
    line-height: 1.5;
    letter-spacing: -1px;
    span {
      font-weight: 400;
    }
    @media (min-width: 426px) {
      font-size: 28px;
    }
  }
  > div {
    display: flex;
    > button {
      margin-left: 8px;
      @media (max-width: 1024px) {
        width: 40px;
        height: 40px;
        padding: 0;
      }
    }
  }
  > nav > a {
    width: 48px;
    height: 48px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 8px;
    border-radius: 24px;
    transition: all 0.25s;
    :hover {
      color: ${props => props.theme.colors.primary};
      box-shadow: 0 5px 10px
        ${props => transparentize(0.8, props.theme.colors.medium)};
    }
  }
`
