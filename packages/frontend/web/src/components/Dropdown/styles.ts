import styled from 'styled-components'

interface Props {
  space?: number
}

export const Container = styled.div<Props>`
  z-index: 99;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.secondary};
  padding: 8px 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  right: 0;
  color: ${props => props.theme.colors.secondaryContrast};
  transform: translateY(4px);
  top: 100%;
  &::before {
    content: '';
    border-style: solid;
    border-color: ${props => props.theme.colors.secondary} transparent;
    border-width: 0px 8px 8px 8px;
    position: absolute;
    bottom: 100%;
    right: ${props => props.space || 10}px;
  }
  a,
  button {
    justify-content: left;
    border-radius: 0;
    svg {
      margin-right: 8px !important;
    }
  }
`
