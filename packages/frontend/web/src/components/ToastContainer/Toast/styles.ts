import { tint } from 'polished'
import { animated } from 'react-spring'
import styled, { css } from 'styled-components'

interface ContainerProps {
  type?: 'success' | 'error' | 'info'
}

const toastTypeVariations = {
  info: css`
    background: ${props => tint(0.8, props.theme.colors.primary)};
    color: ${props => props.theme.colors.primary};
  `,
  success: css`
    background: ${props => tint(0.8, props.theme.colors.success)};
    color: ${props => props.theme.colors.success};
  `,
  error: css`
    background: ${props => tint(0.8, props.theme.colors.danger)};
    color: ${props => props.theme.colors.danger};
  `
}

export const Container = styled(animated.div)<ContainerProps>`
  width: 360px;
  position: relative;
  padding: 16px 30px 16px 16px;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  & + div {
    margin-top: 8px;
  }
  ${props => toastTypeVariations[props.type || 'info']}
  > svg {
    margin: 4px 12px 0 0;
  }
  div {
    flex: 1;
    p {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      line-height: 20px;
    }
  }
  button {
    position: absolute;
    right: 16px;
    top: 18px;
    opacity: 0.6;
    border: 0;
    background: transparent;
    color: inherit;
  }
  svg {
    margin-top: 0;
  }
  @media (max-width: 425px) {
    width: 100%;
  }
`
