import { tint } from 'polished'
import ReactSelect from 'react-select'
import styled from 'styled-components'

export const SelectColumn = styled(ReactSelect)`
  flex: 1;
  .react-select__control {
    border-radius: 10px;
    border-width: 2px;
    min-height: 28px;
    border-color: ${props => tint(0.5, props.theme.colors.medium)};
  }
  .react-select__control--is-focused {
    border-color: ${props => props.theme.colors.primary};
  }
  .react-select__indicator {
    padding: 4px;
  }
  .react-select__value-container {
    height: 24px;
  }
  .react-select__single-value {
    color: ${props => props.theme.colors.medium};
  }
  .react-select__placeholder {
    color: ${props => tint(0.3, props.theme.colors.medium)};
  }
`
export const SearchColumn = styled.div`
  flex: 1;
  margin: 1px;
  border-radius: 10px;
  border: 2px solid;
  display: inline-flex;
  align-items: center;
  padding: 4px;
  color: ${props => tint(0.5, props.theme.colors.medium)};
  input {
    flex: 1;
    margin-left: 4px;
    height: 20px;
    border: none;
    font-weight: 500;
    font-size: 14px;
    color: ${props => props.theme.colors.medium};
    ::placeholder {
      color: ${props => tint(0.3, props.theme.colors.medium)};
    }
  }
  :hover {
    border-color: ${props => tint(0.3, props.theme.colors.medium)};
  }
  :focus-within {
    border-color: ${props => props.theme.colors.primary};
    border-width: 3px;
    margin: 0;
  }
`
