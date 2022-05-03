import { shade, tint } from 'polished'
import styled, { css } from 'styled-components'

import { Tooltip } from '../../Tooltip'

interface InputContainerProps {
  isFocused: boolean
  isFilled: boolean
  isErrored: boolean
  isIcon: boolean
  isDisabled: boolean
}

export const Container = styled.div`
  margin-bottom: 15px;
  > div span {
  }
`

export const InputContainer = styled.div<InputContainerProps>`
  background: ${props => shade(0.1, props.theme.colors.light)};
  border-radius: 10px;
  padding: 12px 15px;
  width: 100%;
  border: 2px solid ${props => shade(0.1, props.theme.colors.light)};
  color: ${props => shade(0.1, props.theme.colors.medium)};
  display: flex;
  align-items: center;
  flex: 1;
  transition: all 0.25s;
  & + div {
    margin-top: 8px;
  }
  ${props =>
    props.isFilled &&
    css`
      color: ${props => shade(0.1, props.theme.colors.dark)};
    `}
  ${props =>
    props.isErrored &&
    css`
      border-color: ${props => props.theme.colors.danger};
    `}
  ${props =>
    props.isFocused &&
    css`
      color: ${props => shade(0.1, props.theme.colors.primary)};
      border-color: ${props => shade(0.1, props.theme.colors.primary)};
    `}
  > input, > textarea {
    height: 20px;
    background: transparent;
    width: 100%;
    border: 0;
    color: inherit;
    &::placeholder {
      color: ${props => shade(0.1, props.theme.colors.medium)};
    }
    ${props =>
      props.isIcon &&
      css`
        margin-left: 16px;
      `}
    &[disabled] {
      cursor: not-allowed;
      color: ${props => tint(0.4, props.theme.colors.dark)};
    }
  }
  > textarea {
    min-height: 100px;
    resize: vertical;
  }
  ${props =>
    props.isDisabled &&
    css`
      cursor: not-allowed;
      background: ${props => tint(0.5, props.theme.colors.medium)};
      border-color: ${props => tint(0.5, props.theme.colors.medium)};
    `}
`

export const LabelArea = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  justify-content: space-between;
  align-items: center;
  label {
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
  }
  > small {
    font-size: 13px;
    display: block;
    margin-bottom: 11px;
    opacity: 0.6;
  }
`

export const IconArea = styled.div`
  height: 24px;
`

export const SecureToggle = styled.button.attrs({
  type: 'button'
})`
  color: ${props => shade(0.1, props.theme.colors.medium)};
  height: 20px;
  width: 20px !important;
  background-color: transparent;
  border: none;
`

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;
  span {
    background: ${props => props.theme.colors.danger};
    color: ${props => props.theme.colors.dangerContrast};
    &::before {
      border-color: ${props => props.theme.colors.danger} transparent;
    }
  }
`

export const ErrorArea = styled.div`
  margin-top: 5px;
  color: ${props => tint(0.1, props.theme.colors.danger)};
  display: flex;
  align-items: center;
  span {
    margin-left: 8px;
    font-size: 0.875rem;
  }
`
