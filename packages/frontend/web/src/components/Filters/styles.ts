import styled from 'styled-components'

export const Container = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.secondaryContrast};
  padding: 24px 0 20px;

  display: flex;
  flex-direction: column;

  transition: 0.5s cubic-bezier(0.5, 0, 0, 1);

  &.active {
    right: 0;
    box-shadow: -1px 0px 10px 0px rgba(0, 0, 0, 0.275);
  }

  @media (min-width: 426px) {
    width: 360px;
  }

  header {
    display: inline-flex;
    align-items: center;
    padding: 0 20px;
    button {
      margin-right: 16px;
      padding: 2px;
      svg {
        margin: 0;
      }
    }
  }

  form {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    button {
      width: 100%;
      margin-top: 8px;
    }
  }
`
