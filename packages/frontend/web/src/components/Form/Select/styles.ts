import { shade, tint } from 'polished'
import ReactSelect from 'react-select'
import styled, { css } from 'styled-components'

export const Container = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 16px;
  }

  > small {
    font-size: 13px;
    display: block;
    margin-bottom: 11px;
    opacity: 0.6;
  }
`

export const SelectComponent = styled(ReactSelect)`
  .react-select__control {
    min-height: 48px;
    margin-bottom: 10px;
    background: ${props => shade(0.1, props.theme.colors.light)};
    border: 2px solid ${props => shade(0.1, props.theme.colors.light)};
    color: ${props => props.theme.colors.lightContrast};
    padding: 2px 8px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: none;
    &:hover {
      border-color: ${props => shade(0.1, props.theme.colors.primary)};
    }
    ${props =>
      props.isErrored &&
      css`
        border-color: ${props => props.theme.colors.danger};
      `}
  }

  .react-select__control--is-focused {
    border-color: ${props => shade(0.1, props.theme.colors.primary)} !important;
    box-shadow: none;
  }

  .react-select__control--is-disabled {
    background: ${props => tint(0.5, props.theme.colors.medium)};
    border-color: ${props => tint(0.5, props.theme.colors.medium)};
    .react-select__single-value {
      color: ${props => tint(0.4, props.theme.colors.dark)};
    }
  }

  .react-select__indicator {
    color: ${props => tint(0.3, props.theme.colors.medium)};
  }

  .react-select__indicator-separator {
    background: ${props => tint(0.3, props.theme.colors.medium)};
  }

  .react-select__menu {
    color: ${props => props.theme.colors.lightContrast};
    background: ${props => shade(0.1, props.theme.colors.light)};
    border: 2px solid ${props => shade(0.1, props.theme.colors.light)};
  }

  .react-select__option {
    background: ${props => shade(0.15, props.theme.colors.light)};
    padding: 10px 15px;
    &:active {
      background: ${props => tint(0.3, props.theme.colors.medium)};
    }
  }

  .react-select__option--is-selected {
    color: inherit;
    background: ${props => tint(0.3, props.theme.colors.medium)};
  }

  .react-select__option--is-focused {
    background: ${props => tint(0.3, props.theme.colors.medium)};
  }

  .react-select__multi-value {
    background: ${props => tint(0.3, props.theme.colors.medium)};
  }

  .react-select__single-value {
    color: ${props => props.theme.colors.lightContrast};
  }

  .react-select__multi-value__label {
    color: ${props => props.theme.colors.lightContrast};
    font-family: Roboto;
    font-weight: bold;
    font-size: 10px;
    text-transform: uppercase;
  }

  .react-select__multi-value__remove {
    color: ${props => props.theme.colors.lightContrast};
    &:hover {
      background: ${props => shade(0.1, props.theme.colors.medium)};
      color: ${props => props.theme.colors.lightContrast};
    }
  }

  .react-select__input input {
    color: ${props => props.theme.colors.lightContrast};
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
