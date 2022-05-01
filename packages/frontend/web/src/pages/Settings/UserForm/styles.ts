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
    @media (min-width: 426px) {
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
  }
`
