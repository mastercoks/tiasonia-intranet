import { shade } from 'polished'
import { AnchorHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: 'small' | 'default' | 'big'
  color?:
    | 'primary'
    | 'secondary'
    | 'primary-outline'
    | 'secondary-outline'
    | 'danger'
    | 'danger-outline'
    | 'success'
    | 'success-outline'
    | 'medium-outline'
    | 'dark-outline'
  inline?: boolean
}

const sizes = {
  small: css`
    padding: 4px 8px;
    font-size: 12px;
  `,
  default: css`
    padding: 6px 12px;
    font-size: 14px;
  `,
  big: css`
    padding: 14px 20px;
    font-size: 16px;
  `
}

const colors = {
  primary: css`
    background: ${props => props.theme.colors.primary};
    border: 2px solid ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primaryContrast};

    &:hover {
      background: ${props => shade(0.1, props.theme.colors.primary)};
      border: 2px solid ${props => shade(0.1, props.theme.colors.primary)};
    }
  `,
  secondary: css`
    background: ${props => props.theme.colors.secondary};
    border: 2px solid ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.secondaryContrast};

    &:hover {
      background: ${props => shade(0.1, props.theme.colors.secondary)};
      border: 2px solid ${props => shade(0.1, props.theme.colors.secondary)};
    }
  `,
  danger: css`
    background: ${props => props.theme.colors.danger};
    border: 2px solid ${props => props.theme.colors.danger};
    color: ${props => props.theme.colors.dangerContrast};

    &:hover {
      background: ${props => shade(0.1, props.theme.colors.danger)};
      border: 2px solid ${props => shade(0.1, props.theme.colors.danger)};
    }
  `,
  'danger-outline': css`
    background: ${props => props.theme.colors.light};
    border: 2px solid ${props => props.theme.colors.danger};
    color: ${props => props.theme.colors.danger};
    &:hover {
      background: ${props => shade(0.05, props.theme.colors.light)};
    }
  `,
  success: css`
    background: ${props => props.theme.colors.success};
    border: 2px solid ${props => props.theme.colors.success};
    color: ${props => props.theme.colors.successContrast};

    &:hover {
      background: ${props => shade(0.1, props.theme.colors.success)};
      border: 2px solid ${props => shade(0.1, props.theme.colors.success)};
    }
  `,
  'success-outline': css`
    background: ${props => props.theme.colors.light};
    border: 2px solid ${props => props.theme.colors.success};
    color: ${props => props.theme.colors.success};
    &:hover {
      background: ${props => shade(0.05, props.theme.colors.light)};
    }
  `,
  'primary-outline': css`
    background: ${props => props.theme.colors.light};
    border: 2px solid ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    &:hover {
      background: ${props => shade(0.05, props.theme.colors.light)};
    }
  `,
  'secondary-outline': css`
    background: ${props => props.theme.colors.light};
    border: 2px solid ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.secondary};
    &:hover {
      background: ${props => shade(0.05, props.theme.colors.light)};
    }
  `,
  'medium-outline': css`
    background: ${props => props.theme.colors.light};
    border: 2px solid ${props => shade(0.15, props.theme.colors.light)};
    color: ${props => shade(0.3, props.theme.colors.medium)};
    &:hover {
      background: ${props => shade(0.15, props.theme.colors.light)};
    }
  `,
  'dark-outline': css`
    background: ${props => props.theme.colors.light};
    border: 2px solid ${props => shade(0.15, props.theme.colors.light)};
    color: ${props => shade(0.3, props.theme.colors.dark)};
    &:hover {
      background: ${props => shade(0.15, props.theme.colors.light)};
    }
  `
}

export const Container = styled.a<AnchorProps>`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primaryContrast};
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  display: ${props => (props.inline ? 'inline-block' : 'flex')};
  align-items: center;
  justify-content: center;
  transition: all 0.2s, color 0.2s;

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  span {
    margin-left: 5px;
  }

  i {
    margin: 0;
  }

  ${props => (props.size ? sizes[props.size] : sizes.default)}
  ${props => (props.color ? colors[props.color] : colors.primary)}
`
