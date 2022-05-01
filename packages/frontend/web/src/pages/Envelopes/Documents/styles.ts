import { shade, tint } from 'polished'
import SimpleBar from 'simplebar-react'
import styled from 'styled-components'
import getTypeColor from 'utils/getTypeColor'
import 'simplebar/dist/simplebar.min.css'

export const Container = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.light};
  color: ${props => props.theme.colors.lightContrast};
  width: 100vw;
  min-height: 100vh;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const Main = styled(SimpleBar)`
  max-height: 100vh;
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
    max-height: 100vh;
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

export const Card = styled.div`
  padding: 25px 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  background-color: ${props => tint(1, props.theme.colors.light)};
  box-shadow: inset 0px 0px 0px 1px
    ${props => shade(0.15, props.theme.colors.light)};
  &.active {
    box-shadow: inset 0px 0px 0px 2px
      ${props => tint(0.1, props.theme.colors.primary)};
  }
  h4,
  svg {
    font-size: 0.875rem;
    color: ${props => props.theme.colors.dark};
  }
  span {
    font-size: 0.75rem;
    color: ${props => shade(0.1, props.theme.colors.medium)};
  }
  h5 {
    margin: 4px 0;
    font-size: 0.75rem;
    color: ${props => tint(0.1, props.theme.colors.dark)};
  }
`

interface StatusProps {
  status?: string
}

export const Status = styled.div<StatusProps>`
  height: 4px;
  width: 40px;
  margin-bottom: 8px;
  border-radius: 10px;
  background-color: ${props => getTypeColor(props?.status)};
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const ClickArea = styled.a`
  > div:hover {
    background: ${props => shade(0.15, props.theme.colors.light)};
  }
`

export const MessageContainer = styled(SimpleBar)`
  max-height: 50vh;
  padding: 25px 20px 40px;
  span {
    white-space: pre-line;
  }
`

export const HidePDFView = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70vh;
  > div {
    padding: 40px;
    > * {
      margin-bottom: 20px;
    }
    > div {
      margin: 30px 0;
    }
  }
`
