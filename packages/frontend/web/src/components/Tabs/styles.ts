import { shade, tint } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  padding-left: 20px;
  input {
    display: none;
  }
  label {
    border-radius: 20px 20px 0 0;
    padding: 15px 25px;
    color: ${props => props.theme.colors.medium};
    margin-bottom: -1px;
    margin-left: -1px;
    display: inline-flex;
    align-items: center;
    font-size: 0.875rem;
    border: 1px solid transparent;
    border-bottom: none;
    span {
      margin-left: 12px;
    }
  }
  input:checked + label {
    background-color: ${props => tint(1, props.theme.colors.light)};
    color: ${props => tint(0.1, props.theme.colors.primary)};
    border-color: ${props => shade(0.1, props.theme.colors.light)};
    cursor: pointer;
  }
  label:hover {
    color: ${props => tint(0.1, props.theme.colors.primary)};
    cursor: pointer;
  }
`
