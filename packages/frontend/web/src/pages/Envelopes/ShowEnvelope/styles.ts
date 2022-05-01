import { shade } from 'polished'
import SimpleBar from 'simplebar-react'
import styled from 'styled-components'
import 'simplebar/dist/simplebar.min.css'

export const Container = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.light};
  color: ${props => props.theme.colors.lightContrast};
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`

export const Main = styled(SimpleBar)`
  max-height: calc(100vh - 64px);
  padding: 25px 20px 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const ASidebar = styled(SimpleBar)`
  display: flex;
  flex-direction: column;
  box-shadow: inset 1px 0px 0px
    ${props => shade(0.15, props.theme.colors.light)};
  padding: 25px 20px;
  @media (min-width: 769px) {
    width: 300px;
    max-height: calc(100vh - 64px);
  }
  header {
    height: 64px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    h1 {
      margin-left: 8px;
      font-size: 1.5rem;
    }
  }
  button {
    width: 100%;
    margin-bottom: 16px;
  }
  h3 {
    font-size: 1rem;
    margin-bottom: 8px;
    margin-top: 20px;
  }
`
