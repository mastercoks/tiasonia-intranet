import { shade } from 'polished'
import ReactSelect from 'react-select'
import styled from 'styled-components'

export const DataTable = styled.table`
  width: 100%;
  border-spacing: 4px;
  font-size: 14px;
  thead {
    th {
      padding: 12px 6px;
      text-align: center;
      font-weight: 500;
      vertical-align: top;
      color: ${props => props.theme.colors.medium};
      :first-child {
        text-align: left;
      }
      &[role='columnheader'] {
        min-width: 100px;
        margin-right: 8px;
        > div {
          display: flex;
          align-items: center;
        }
        [role='columnheader'] {
          display: inline-flex;
          align-items: center;
        }
        > div + div {
          margin-top: 8px;
        }
        [title='Toggle GroupBy'] {
          margin: 0 8px;
          display: inherit;
        }
        [title='Toggle SortBy'] {
          display: inherit;
          align-items: center;
          span {
            text-align: left;
            width: max-content;
          }
          svg {
            margin-left: 8px;
          }
        }
      }
    }
  }
  tbody {
    tr {
      background-color: ${props => shade(0.05, props.theme.colors.light)};
      color: ${props => props.theme.colors.dark};
      td {
        height: 36px;
        border-radius: 4px;
        vertical-align: middle;
        padding: 6px;
        text-align: center;
        white-space: nowrap;

        a {
          color: ${props => shade(0.1, props.theme.colors.primary)};
        }

        span {
          margin-right: 5px;
          display: inline-flex;
          align-items: center;
        }

        :first-child {
          text-align: left;
          font-weight: 500;
          position: relative;
          padding-left: 16px;
          ::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 4px;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            background-color: ${props => props.theme.colors.primary};
          }
          &.inactive {
            ::before {
              background-color: ${props => props.theme.colors.danger};
            }
          }
        }

        &.button {
          padding: 0;
          background-color: transparent;
          > button {
            border-radius: 4px;
            padding: 6px;
            svg {
              margin: 0;
            }
          }
        }

        h3 {
          margin: 0;
          font-weight: 500;
        }

        span {
          margin-right: 5px;
        }
      }
    }
  }
`

export const NoDataContainer = styled.div`
  height: 264px;
  justify-content: center;
  align-items: center;
  display: flex;
  span {
    color: ${props => props.theme.colors.dark};
    text-align: center;
    font-size: 14px;
    font-weight: 500;
  }
`

export const Pagination = styled.footer`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;

  > p {
    opacity: 0.8;

    span + span {
      border-left: 1px solid ${props => props.theme.colors.dark};
      padding-left: 10px;
      margin-left: 10px;
    }
  }

  nav {
    display: flex;

    button {
      margin-left: 5px;
    }
  }
`
export const PaginateList = styled.div`
  display: flex;
  margin: 0 15px;
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 32px;
    height: 32px;
    &.active {
      color: ${props => props.theme.colors.primary};
      font-weight: 500;
    }
  }
`
export const SelectPerPage = styled(ReactSelect)`
  width: 75px;
  margin-left: 16px;
  .react-select__control {
    border-radius: 10px;
    border-width: 2px;
    min-height: 30px;
  }
  .react-select__indicator {
    padding: 4px;
  }
  .react-select__value-container {
    color: ${props => props.theme.colors.dark};
    opacity: 0.8;
  }
`
