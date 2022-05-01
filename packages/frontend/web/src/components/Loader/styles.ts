import { tint } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  height: 8px;
  display: block;
  width: 100%;
  background-color: ${props => tint(0.5, props.theme.colors.primary)};
  border-radius: 4px;
  background-clip: padding-box;
  margin: 6px 0;
  overflow: hidden;
`

export const Indeterminate = styled.div`
  background-color: ${props => props.theme.colors.primary};
  &::before {
    content: '';
    position: absolute;
    background-color: inherit;
    top: 0;
    left: 0;
    bottom: 0;
    will-change: left, right;
    animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395)
      infinite;
  }
  &::after {
    content: '';
    position: absolute;
    background-color: inherit;
    top: 0;
    left: 0;
    bottom: 0;
    will-change: left, right;
    animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
      infinite;
    animation-delay: 1.15s;
  }

  @keyframes indeterminate {
    0% {
      left: -35%;
      right: 100%;
    }
    60% {
      left: 100%;
      right: -90%;
    }
    100% {
      left: 100%;
      right: -90%;
    }
  }

  @keyframes indeterminate-short {
    0% {
      left: -200%;
      right: 100%;
    }
    60% {
      left: 107%;
      right: -8%;
    }
    100% {
      left: 107%;
      right: -8%;
    }
  }
`
