import { shade, tint, transparentize } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  background-color: ${props => tint(1, props.theme.colors.light)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: inset 0px -1px 0px ${props => shade(0.1, props.theme.colors.light)};
  span {
    flex: 1;
    font: 500 18px 'Roboto', sans-serif;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  a,
  > div {
    cursor: pointer;
    display: inline-flex;
    width: 48px;
    height: 48px;
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
  @media (min-width: 426px) {
    span {
      font-size: 20px;
      text-align: initial;
    }
  }
  @media (min-width: 768px) {
    span {
      margin-left: 32px;
    }
  }
`
