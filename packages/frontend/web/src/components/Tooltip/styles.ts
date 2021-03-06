import { tint } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  display: inline-block;
  span {
    background: ${props => props.theme.colors.secondary};
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.4s;
    visibility: hidden;
    position: absolute;
    bottom: calc(100% + 12px);
    /* width: 200px; */
    left: 50%;
    transform: translateX(-50%);
    color: ${props => tint(0.1, props.theme.colors.light)} !important;
    &::before {
      content: '';
      border-style: solid;
      border-color: ${props => props.theme.colors.secondary} transparent;
      border-width: 6px 6px 0 6px;
      top: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  &:hover span {
    opacity: 1;
    visibility: visible;
  }
`
