import React, { useMemo } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import SimpleBar from 'simplebar-react'

import {
  PaginatedRequest,
  OptionType
} from '../../services/usePaginatedRequest'
import theme from '../../styles/theme'
import Button from '../Button'
import Spinner from '../Spinner'
import {
  DataTable,
  NoDataContainer,
  PaginateList,
  Pagination,
  SelectPerPage
} from './styles'

import 'simplebar/dist/simplebar.min.css'

interface Props {
  request: PaginatedRequest<any, unknown>
  children: React.ReactNode
}

const PaginatedTable: React.FC<Props> = ({ request, children }) => {
  const {
    data,
    error,
    page,
    perPage,
    response,
    hasPreviousPage,
    hasNextPage,
    loadPrevious,
    loadNext,
    handlePerPage,
    goToPage
  } = request

  const numberOfRegisters = useMemo(() => response?.headers['x-total-count'], [
    response
  ])

  const numberOfPages = useMemo(() => response?.headers['x-total-page'], [
    response
  ])

  const pages = useMemo(() => {
    const pages = []
    for (let index = 1; index <= numberOfPages; index++) {
      const upper = page + (page < 5 ? 7 - page : 3)
      const lower =
        page - (page + 3 > numberOfPages ? page + 6 - numberOfPages : 3)
      if (
        (index > lower && index < upper) ||
        index === 1 ||
        index === Number(numberOfPages)
      ) {
        pages.push({
          value:
            (index - 1 > lower && index + 1 < upper) ||
            index < 3 ||
            index > numberOfPages - 2
              ? index
              : 0,
          label:
            (index - 1 > lower && index + 1 < upper) ||
            index < 3 ||
            index > numberOfPages - 2
              ? String(index)
              : '...'
        })
      }
    }
    return pages
  }, [page, numberOfPages])

  return (
    <>
      <SimpleBar>
        <DataTable>{children}</DataTable>
      </SimpleBar>
      {(!data || data?.length === 0) && (
        <NoDataContainer>
          {data?.length === 0 ? (
            <span>Não há registros a serem exibidos</span>
          ) : error ? (
            <span>{error}</span>
          ) : (
            <Spinner size={50} color={theme.colors.primary} />
          )}
        </NoDataContainer>
      )}
      <Pagination>
        <p>
          <span>
            {!data || data?.length === 0 ? 0 : 1 + (page - 1) * perPage.value}
            {' - '}
            {!data
              ? 0
              : !hasNextPage
              ? numberOfRegisters
              : page * perPage.value}
            {' de '}
            {!data ? 0 : numberOfRegisters}
          </span>
        </p>

        <nav>
          <Button
            size="small"
            disabled={!hasPreviousPage}
            onClick={loadPrevious}
            color="medium-outline"
            style={{ padding: 2 }}
          >
            <BiChevronLeft size={24} style={{ margin: 0 }} />
          </Button>
          <PaginateList className="hide-lg-down">
            {pages.map(({ value, label }) => (
              <a
                key={value}
                className={value === page ? 'active' : ''}
                onClick={() => goToPage(value)}
              >
                {label}
              </a>
            ))}
          </PaginateList>
          <Button
            size="small"
            disabled={!hasNextPage}
            onClick={loadNext}
            color="medium-outline"
            style={{ padding: 2 }}
          >
            <BiChevronRight size={24} style={{ margin: 0 }} />
          </Button>
          <SelectPerPage
            classNamePrefix="react-select"
            name="per_page"
            onChange={(value: OptionType) => {
              handlePerPage(value)
            }}
            placeholder=""
            defaultValue={{ value: 10, label: '10' }}
            value={perPage}
            options={[
              { value: 10, label: '10' },
              { value: 20, label: '20' },
              { value: 30, label: '30' },
              { value: 50, label: '50' }
            ]}
            isSearchable={false}
          />
        </nav>
      </Pagination>
    </>
  )
}

export default PaginatedTable
