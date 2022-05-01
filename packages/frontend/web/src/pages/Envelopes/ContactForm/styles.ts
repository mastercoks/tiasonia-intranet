import styled from 'styled-components'

export const Container = styled.div`
  padding: 25px 20px;
`

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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