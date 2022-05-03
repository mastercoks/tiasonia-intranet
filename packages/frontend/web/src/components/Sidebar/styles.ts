import { shade, tint } from 'polished'
import SimpleBar from 'simplebar-react'
import styled from 'styled-components'
import 'simplebar/dist/simplebar.min.css'

interface ItemProps {
  active?: boolean
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 240px;
  min-width: 240px;
  background-color: ${props => tint(1, props.theme.colors.light)};
  box-shadow: inset -1px 0px 0px ${props => shade(0.1, props.theme.colors.light)};
  @media (max-width: 768px) {
    position: fixed;
    top: 64px;
    left: 0;
    z-index: 10;
    transform: translateX(-100%);
    transition: 0.5s transform cubic-bezier(0.5, 0, 0, 1);
    &.active {
      transform: translateX(0);
    }
  }
`

export const LogoArea = styled.div`
  height: 140px;
  min-height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 120px;
    min-width: 120;
  }
`

export const Nav = styled(SimpleBar)`
  max-height: calc(100% - 140px);
  @media (max-width: 768px) {
    max-height: calc(100% - 204px);
  }
`

export const ItemContainer = styled.div<ItemProps>`
  padding: 0px 20px;
  margin-bottom: 10px;
  > div:first-child {
    display: flex;
    align-items: center;
    > svg {
      cursor: pointer;
    }
  }
  svg {
    color: ${props => shade(0.1, props.theme.colors.medium)};
    min-width: 21px;
    min-height: 21px;
  }
  a {
    text-decoration: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    position: relative;
    height: 56px;
    flex: 1;
    color: ${props => shade(0.1, props.theme.colors.dark)};
    :hover,
    :hover svg,
    &.active,
    &.active svg {
      color: ${props => props.theme.colors.primary};
    }
    svg {
      margin-right: 16px;
    }
    span {
      flex: 1;
      font: 500 14px Poppins, sans-serif;
      line-height: 24px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      & + svg {
        margin: 0;
        color: ${props => shade(0.1, props.theme.colors.medium)} !important;
      }
    }
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -20px;
      width: 3px;
      height: 32px;
      border-radius: 0 3px 3px 0;
      display: none;
      background: ${props => props.theme.colors.primary};
      transform: translateY(-50%);
      transition: opacity 0.25s;
    }
    &.active {
      ::before {
        display: block;
      }
    }
  }
`

export const ItemText = styled.text`
  font: 500 14px Poppins, sans-serif;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const SubItems = styled.div`
  padding-left: 40px;
  a {
    &.active::before {
      display: none;
    }
    span {
      font-weight: 400;
    }
  }
`
