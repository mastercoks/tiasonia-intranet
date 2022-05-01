import React, { useMemo } from 'react'
import {
  BiDownArrowAlt,
  BiRightArrowAlt,
  BiChevronLeft,
  BiChevronRight,
  BiCollapse,
  BiExpand,
  BiSortAZ,
  BiSortZA,
  BiSearch
} from 'react-icons/bi'
import {
  useExpanded,
  useFilters,
  useGroupBy,
  usePagination,
  useSortBy,
  useTable,
  TableOptions
} from 'react-table'
import SimpleBar from 'simplebar-react'

import 'simplebar/dist/simplebar.min.css'

import { OptionType } from '../../services/usePaginatedRequest'
import theme from '../../styles/theme'
import Button from '../Button'
import {
  DataTable,
  NoDataContainer,
  PaginateList,
  Pagination,
  SelectPerPage
} from '../PaginatedTable/styles'
import Spinner from '../Spinner'
import { SearchColumn, SelectColumn } from './styles'

export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id }
}: {
  column: {
    filterValue: string
    setFilter: (option: number) => void
    preFilteredRows: any[]
    id: number
  }
}): any {
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach((row: any) => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])
  return (
    <SelectColumn
      classNamePrefix="react-select"
      onChange={(option: OptionType) => {
        setFilter(option?.value)
      }}
      placeholder="Todos"
      options={options.map((option: any) => ({
        value: option,
        label: option
      }))}
      noOptionsMessage={() => 'Nenhuma opção'}
      isClearable
    />
  )
}

function DefaultColumnFilter({
  column: { filterValue, setFilter }
}: {
  column: {
    filterValue: string
    setFilter: (e: any) => void
  }
}) {
  return (
    <SearchColumn>
      <BiSearch size={20} />
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
        placeholder={'Buscar'}
      />
    </SearchColumn>
  )
}

function useControlledState(state: any, { instance }: { instance: any }) {
  return useMemo(() => {
    if (state.groupBy.length) {
      return {
        ...state,
        hiddenColumns: [...state.hiddenColumns, ...state.groupBy].filter(
          (d, i, all) => all.indexOf(d) === i
        )
      }
    }
    return state
  }, [state])
}

interface ITable extends TableOptions<any> {
  error?: boolean
}

const Table: React.FC<ITable> = ({ columns, data, loading, error }) => {
  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      defaultColumn
    },
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    hooks => {
      hooks.useControlledState.push(useControlledState)
      hooks.visibleColumns.push((columns, { instance }) => {
        if (!instance.state.groupBy.length) {
          return columns
        }

        return [
          {
            id: 'expander',
            Header: ({ allColumns, state: { groupBy } }) => {
              return groupBy.map((columnId: any, key) => {
                const column = allColumns.find(d => d.id === columnId)

                return (
                  <span {...column?.getHeaderProps()} key={key}>
                    {column?.canGroupBy ? (
                      <span {...column?.getGroupByToggleProps()}>
                        {column.isGrouped ? (
                          <BiExpand size={20} color={theme.colors.primary} />
                        ) : (
                          <BiCollapse size={20} color={theme.colors.primary} />
                        )}
                      </span>
                    ) : null}
                    {column?.render('Header')}{' '}
                  </span>
                )
              })
            },
            Cell: ({ row }) => {
              if (row.canExpand) {
                const groupedCell = row.allCells.find(d => d.isGrouped)

                return (
                  <span
                    {...row.getToggleRowExpandedProps({
                      style: {
                        paddingLeft: `${row.depth * 2}rem`
                      }
                    })}
                  >
                    {row.isExpanded ? (
                      <BiDownArrowAlt
                        size={18}
                        style={{ marginRight: '8px' }}
                        color={theme.colors.primary}
                      />
                    ) : (
                      <BiRightArrowAlt
                        size={18}
                        style={{ marginRight: '8px' }}
                        color={theme.colors.primary}
                      />
                    )}{' '}
                    {groupedCell?.render('Cell')} ({row.subRows.length})
                  </span>
                )
              }

              return null
            }
          },
          ...columns
        ]
      })
    }
  )

  const pages = useMemo(() => {
    const pages = []
    for (let index = 1; index <= pageCount; index++) {
      const upper = pageIndex + 1 + (pageIndex < 4 ? 6 - pageIndex : 3)
      const lower =
        pageIndex +
        1 -
        (pageIndex + 4 > pageCount ? pageIndex + 7 - pageCount : 3)
      if (
        (index > lower && index < upper) ||
        index === 1 ||
        index === Number(pageCount)
      ) {
        const showNumber =
          (index - 1 > lower && index + 1 < upper) ||
          index < 3 ||
          index > pageCount - 2
        pages.push({
          value: showNumber ? index : 0,
          label: showNumber ? String(index) : '...'
        })
      }
    }
    return pages
  }, [pageCount, pageIndex])

  return (
    <>
      <SimpleBar>
        <DataTable {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup: any, key) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={key}>
                {headerGroup.headers.map((column: any, i: any) => (
                  <th {...column.getHeaderProps()} key={i}>
                    <div>
                      {column.canGroupBy ? (
                        <span {...column.getGroupByToggleProps()}>
                          {column.isGrouped ? (
                            <BiExpand size={20} color={theme.colors.primary} />
                          ) : (
                            <BiCollapse
                              size={20}
                              color={theme.colors.primary}
                            />
                          )}
                        </span>
                      ) : null}
                      <span {...column.getSortByToggleProps()}>
                        <span>{column.render('Header')}</span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <BiSortZA size={20} color={theme.colors.primary} />
                          ) : (
                            <BiSortAZ size={20} color={theme.colors.primary} />
                          )
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                    <div>
                      {column.canFilter ? column.render('Filter') : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {!loading &&
              page.map((row: any, key) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()} key={key}>
                    {row.cells.map((cell: any, i: any) => {
                      return (
                        <td {...cell.getCellProps()} key={i}>
                          {cell.isGrouped ? (
                            <>
                              <span {...row.getToggleRowExpandedProps()}>
                                {row.isExpanded ? (
                                  <BiDownArrowAlt
                                    size={18}
                                    style={{ marginRight: '8px' }}
                                    color={theme.colors.primary}
                                  />
                                ) : (
                                  <BiRightArrowAlt
                                    size={18}
                                    style={{ marginRight: '8px' }}
                                    color={theme.colors.primary}
                                  />
                                )}
                              </span>{' '}
                              {cell.render('Cell')} ({row.subRows.length})
                            </>
                          ) : cell.isAggregated ? (
                            cell.render('Aggregated')
                          ) : cell.isPlaceholder ? null : (
                            cell.render('Cell')
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
          </tbody>
        </DataTable>
      </SimpleBar>

      {loading && (
        <NoDataContainer>
          <Spinner size={50} color={theme.colors.primary} />
        </NoDataContainer>
      )}
      {!loading && !error && data?.length === 0 && (
        <NoDataContainer>
          <span>Não há registros a serem exibidos</span>
        </NoDataContainer>
      )}
      {!loading && error && (
        <NoDataContainer>
          <span>Ocorreu um erro, entre em contato com o adminstrador</span>
        </NoDataContainer>
      )}
      <Pagination>
        <p>
          <span>
            {!data || data?.length === 0 ? 0 : 1 + pageIndex * pageSize}
            {' - '}
            {!data
              ? 0
              : !canNextPage
              ? data.length
              : (pageIndex + 1) * pageSize}
            {' de '}
            {!data ? 0 : data.length}
          </span>
        </p>

        <nav>
          <Button
            size="small"
            disabled={!canPreviousPage}
            onClick={previousPage}
            color="medium-outline"
            style={{ padding: 2 }}
          >
            <BiChevronLeft size={24} style={{ margin: 0 }} />
          </Button>
          <PaginateList className="hide-lg-down">
            {pages.map(({ value, label }, key) => (
              <a
                key={key}
                className={value === pageIndex + 1 ? 'active' : ''}
                onClick={() => gotoPage(value - 1)}
              >
                {label}
              </a>
            ))}
          </PaginateList>
          <Button
            size="small"
            disabled={!canNextPage}
            onClick={nextPage}
            color="medium-outline"
            style={{ padding: 2 }}
          >
            <BiChevronRight size={24} style={{ margin: 0 }} />
          </Button>
          <SelectPerPage
            classNamePrefix="react-select"
            name="per_page"
            onChange={({ value }: OptionType) => {
              setPageSize(Number(value))
            }}
            placeholder=""
            defaultValue={{ value: 10, label: '10' }}
            value={{ value: pageSize, label: String(pageSize) }}
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

export default Table
