import { shade, transparentize } from 'polished'
import styled from 'styled-components'

interface ModalProps {
  size: 'sm' | 'md'
}

export const Container = styled.div`
  display: none;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  &.show {
    display: flex !important;
  }
  header {
    h2 {
      display: flex;
      margin: 0;
      font: 600 1.25rem 'Poppins', sans-serif;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      svg {
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 0.5rem;
      }
    }
    button {
      padding: 4px;
      border: none;
      margin: 0 0 0 8px;
      width: auto;
    }
  }
  form,
  main {
    display: flex;
    flex-direction: column;
    padding: 25px 30px;
    fieldset {
      width: 100%;
    }
  }
  fieldset {
    border: none;
    margin-bottom: 20px;
    label {
      font: 600 0.75rem 'Poppins', sans-serif;
      margin-top: 8px;
      display: block;
    }
    > div {
      font: 500 0.875rem 'Poppins', sans-serif;
      display: flex;
      align-items: center;
      > span {
        flex: 1;
        margin-left: 12px;
      }
    }
  }
  footer {
    border-top: 2px solid ${props => shade(0.1, props.theme.colors.light)};
    padding: 25px 30px;
    display: flex;
    flex-wrap: wrap;
    > * {
      width: 100%;
      margin-bottom: 20px;
      height: fit-content;
      &:last-child {
        margin-bottom: 0;
        margin-right: 0;
      }
      @media (min-width: 426px) {
        margin-left: 8px;
        margin-right: 8px;
        margin-bottom: 0;
        width: calc(calc(100% - 16px) / 2);
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
`

export const CloseArea = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: ${props => transparentize(0.4, props.theme.colors.dark)};
  z-index: -1;
`

export const ModalContainer = styled.div<ModalProps>`
  max-width: ${props => props.theme.modal.size[props.size]};
  width: 80%;
`
