import { tint } from 'polished'
import styled from 'styled-components'

import { Form } from '../../components'

export const Container = styled.div`
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 24px 20px;
  @media (min-width: 1025px) {
    display: grid;
    grid-template-columns: 1fr 480px 480px 1fr;
    grid-template-rows: 1fr 480px 1fr;
    grid-template-areas:
      '. . . .'
      '. logo form .'
      '. . . .';
  }
`

export const LogoContent = styled.div`
  display: flex;
  grid-area: logo;
  flex-direction: column;
  align-items: center;
  div {
    display: flex;
    justify-content: center;
    margin: 20px 0;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    h1 {
      font: 600 30px Poppins, sans-serif;
    }
    img {
      width: 70px;
    }
  }
  h2 {
    font: 600 20px Poppins, sans-serif;
    text-align: center;
    margin: 12px 0 30px;
  }
  @media (min-width: 426px) {
    margin-bottom: 24px;
    div {
      h1 {
        font-size: 40px;
      }
      img {
        width: 240px;
      }
    }
    h2 {
      font-size: 24px;
    }
  }
  @media (min-width: 769px) {
    h2 {
      font-size: 32px;
    }
  }
  @media (min-width: 1025px) {
    align-items: flex-start;
    h2 {
      font-size: 54px;
      text-align: initial;
    }
  }
`

export const FormContent = styled(Form)`
  grid-area: form;
  height: 100%;
  background-color: ${props => tint(0.3, props.theme.colors.light)};
  color: ${props => props.theme.colors.lightContrast};
  border-radius: 8px;
  flex-direction: column;
  align-items: stretch;
  padding: 20px;
  h2 {
    margin-bottom: 32px;
    font-size: 20px;
  }
  @media (min-width: 426px) {
    padding: 40px;
    h2 {
      font-size: 24px;
    }
  }
  @media (min-width: 769px) {
    padding: 64px;
    margin: 20px 0px;
  }
`
