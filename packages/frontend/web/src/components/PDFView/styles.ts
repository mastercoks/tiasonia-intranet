import { transparentize } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  .react-pdf__Document {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .react-pdf__Page {
      box-shadow: 6px 6px 12px ${props => props.theme.colors.medium};
      border: 0.5px solid
        ${props => transparentize(0.1, props.theme.colors.light)};
      border-radius: 6px;
      overflow: overlay;
      margin-bottom: 10px;
    }
  }
`
