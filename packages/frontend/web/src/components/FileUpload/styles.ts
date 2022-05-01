import { shade, tint } from 'polished'
import styled, { css } from 'styled-components'

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  > label {
    font-size: 1.5rem;
    margin: 12px 0;
  }
`

interface DropAreaProps {
  isEmpty: boolean
  isDragging: boolean
}

export const DropArea = styled.div<DropAreaProps>`
  padding: 24px;
  color: ${props => shade(0.1, props.theme.colors.medium)};
  border: 2px dashed ${props => tint(0.3, props.theme.colors.medium)};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.5s;
  span {
    font-size: 0.9375rem;
    margin: 6px 0;
  }
  span + button {
    margin-left: 8px;
  }
  :hover {
    color: ${props => props.theme.colors.primary};
    border-color: ${props => tint(0.1, props.theme.colors.primary)};
  }
  ${props =>
    props.isDragging &&
    css`
      color: ${props => props.theme.colors.primary};
      border-color: ${props => tint(0.1, props.theme.colors.primary)};
    `}
  ${props =>
    props.isEmpty &&
    css`
      flex: 1;
      flex-direction: column;
      span {
        font-size: 1.125rem;
        margin: 1rem 0;
      }
      span + button {
        margin-top: 3px;
        margin-left: 0px;
      }
    `}
`

export const InputFile = styled.input`
  display: none;
`
