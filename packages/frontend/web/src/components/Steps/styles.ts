import { shade } from 'polished'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { IconType } from 'react-icons/lib'
import styled from 'styled-components'

const reactSvgComponentToMarkupString = (component: IconType, props: any) =>
  `data:image/svg+xml,${encodeURIComponent(
    renderToStaticMarkup(createElement(component, props))
  )}`

export const Container = styled.div``

interface StepProps {
  icon: IconType | string
}

export const Step = styled.div<StepProps>`
  position: relative;
  color: ${props => props.theme.colors.dark};
  &::before {
    height: 2rem;
    width: 2rem;
    line-height: 2.2rem;
    box-sizing: border-box;
    border: 1px solid ${props => shade(0.2, props.theme.colors.light)};
    background-color: ${props => props.theme.colors.light};
    color: ${props => shade(0.2, props.theme.colors.medium)};
    border-radius: 50%;
    position: absolute;
    text-align: center;
    top: 0;
    transform: translateX(50%);
    z-index: 1;
    font: 500 1.25rem 'Poppins', sans-serif;
    content: ${props =>
      typeof props.icon === 'string'
        ? `'${props.icon}'`
        : `url(${reactSvgComponentToMarkupString(props.icon, {
            color: props.theme.colors.medium
          })})`};
  }
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    width: 1px;
    height: calc(100% - 20px);
    left: 31.5px;
    top: 36px;
    background-color: ${props => shade(0.2, props.theme.colors.light)};
  }
`
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 4rem;
  margin-bottom: 20px;
  font-size: 14px;
  > label {
    margin: 6px 0;
    line-height: 18px;
    font-weight: 600;
    color: ${props => props.theme.colors.medium};
    text-transform: uppercase;
    position: relative;
  }
  > h4 {
    margin: 6px 0;
  }
`
