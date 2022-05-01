import { shade, tint, transparentize } from 'polished'
import { BaseHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

interface IconProps extends BaseHTMLAttributes<HTMLDivElement> {
  state: 'online' | 'offline' | 'loading'
  size?: number
}

export const Container = styled.div`
  cursor: pointer;
  border-radius: 20px;
  background-color: ${props => tint(1, props.theme.colors.light)};
  box-shadow: inset 0px 0px 0px 1px
    ${props => shade(0.1, props.theme.colors.light)};
  width: calc((100vw - 310px) / 5);
  padding: 30px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  div + div {
    margin-left: 30px;
  }
  span {
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 10px;
    color: ${props => props.theme.colors.light};
    display: inline-block;
    margin-bottom: 4px;
  }
  h3 {
    font-size: 1.25rem;
    margin-bottom: 11px;
    font-weight: 500;
  }
  h4 {
    font-size: 1rem;
    font-weight: 400;
    color: ${props => props.theme.colors.medium};
  }
  @media (max-width: 1920px) {
    width: calc((100vw - 310px) / 4);
  }
  @media (max-width: 1440px) {
    width: calc((100vw - 310px) / 3);
  }
  @media (max-width: 1024px) {
    width: calc((100vw - 310px) / 2);
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`

const colors = {
  online: css`
    background-color: ${props =>
      transparentize(0.8, props.theme.colors.success)};
    color: ${props => props.theme.colors.success};
  `,
  offline: css`
    background-color: ${props =>
      transparentize(0.8, props.theme.colors.danger)};
    color: ${props => props.theme.colors.danger};
  `,
  loading: css`
    background-color: ${props =>
      transparentize(0.8, props.theme.colors.warning)};
    color: ${props => props.theme.colors.warning};
  `
}

export const IconArea = styled.div<IconProps>`
  display: inline-flex;
  padding: ${props => props.size || 16}px;
  border-radius: 50%;
  transition: all 0.5s;
  ${props => (props.state ? colors[props.state] : colors.loading)}
  ${props =>
    props.state === 'loading' && 'animation: rotation 2s infinite linear;'}

  @keyframes rotation {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`
