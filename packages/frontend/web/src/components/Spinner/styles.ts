import { transparentize } from 'polished'
import styled, { keyframes, css } from 'styled-components'

interface Props {
  size: number
}

export const SpinnerContainer = styled.i<Props>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  display: block;
  position: relative;
  margin: 0 auto;
`

const skBounce = keyframes`
  0%, 100% { -webkit-transform: scale(0.0) }
  50% { -webkit-transform: scale(1.0) }
`

export const Bounce1 = styled.i`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${props =>
    transparentize(0.6, props.color || props.theme.colors.primary)};
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  ${css`
    animation: ${skBounce} 2s infinite ease-in-out;
  `}
`

export const Bounce2 = styled.i`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${props =>
    transparentize(0.6, props.color || props.theme.colors.primary)};
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  ${css`
    animation: ${skBounce} 2s infinite ease-in-out;
    animation-delay: -1s;
  `}
`
