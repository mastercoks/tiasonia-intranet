import { transparentize } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  padding: 25px 20px;
`

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 15px;
  > div {
    width: 100%;
    :last-child {
      margin-bottom: 0;
    }
    @media (min-width: 426px) and (max-width: 1023px) {
      width: calc(100% / 2 - 11px);
      :not(:nth-child(2n)) {
        margin-right: 8px;
      }
      :not(:nth-child(2n + 1)) {
        margin-left: 8px;
      }
      :nth-last-child(2) {
        margin-bottom: 0;
      }
    }
    @media (min-width: 1024px) {
      width: calc(100% / 3 - 11px);
      :not(:nth-child(3n)) {
        margin-right: 8px;
      }
      :not(:nth-child(3n + 1)) {
        margin-left: 8px;
      }
      :nth-last-child(2),
      :nth-last-child(3) {
        margin-bottom: 0;
      }
    }
  }
`

export const AvatarInput = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 30px auto;
  background-color: ${props => transparentize(0.7, props.theme.colors.medium)};
  border-radius: 50%;
`

export const VisuallyHidden = styled.input`
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  &:focus + label,
  &:focus-within + label {
    outline: 8px solid
      ${props => transparentize(0.7, props.theme.colors.primary)};
  }
`
export const FileLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  cursor: pointer;
`
export const ImagePreview = styled.img`
  display: block;
  width: 140px;
  height: 140px;
  object-fit: contain;
  padding: 10px;
`
