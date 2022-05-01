import { FormHandles } from '@unform/core'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BiExport, BiFilterAlt } from 'react-icons/bi'

import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Filters, { FilterHandles } from '../../../components/Filters'
import { AsyncSelect, Form, Input, Select } from '../../../components/Form'
import Header from '../../../components/Header'
import Table, { SelectColumnFilter } from '../../../components/Table'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import capitalize from '../../../utils/capitalize'
import { Container, ScrollArea, Buttons } from './styles'

interface Row {
  cost_center: string
  type: string
  company: string
  collaborator: string
  schedule: string
  count: number
}

interface Reader {
  id: string
  name: string
  ip_address: string
  type: {
    id: string
    name: string
  }
}

const Reports: React.FC = () => {
  const filterRef = useRef<FilterHandles>(null)
  const formRef = useRef<FormHandles>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filters, setFilters] = useState({})
  const [data, setData] = useState([])
  const { addToast } = useToast()

  const columns = useMemo(
    () => [
      {
        Header: 'Centro de Custo',
        accessor: 'cost_center',
        aggregate: 'uniqueCount',
        Aggregated: ({ value }: { value: any }) => `${value} Centros de Custo`
      },
      {
        Header: 'Nome',
        accessor: 'collaborator',
        aggregate: 'uniqueCount',
        Aggregated: ({ value }: { value: any }) => `${value} Colaboradore(s)`
      },
      {
        Header: 'Tipo',
        accessor: 'type',
        Filter: SelectColumnFilter,
        filter: 'includes',
        aggregate: 'uniqueCount',
        Aggregated: ({ value }: { value: any }) => `${value} Tipo(s)`
      },
      {
        Header: 'Empresa',
        accessor: 'company',
        Filter: SelectColumnFilter,
        filter: 'includes',
        aggregate: 'uniqueCount',
        Aggregated: ({ value }: { value: any }) => `${value} Empresa(s)`
      },
      {
        Header: 'Horário',
        accessor: 'schedule',
        Filter: SelectColumnFilter,
        filter: 'includes',
        aggregate: 'uniqueCount',
        Aggregated: ({ value }: { value: any }) => `${value} Horário(s)`
      },
      {
        Header: 'Quantidade',
        accessor: 'count',
        disableFilters: true,
        aggregate: 'sum',
        Aggregated: ({ value }: { value: any }) => `${value} (total)`
      }
    ],
    []
  )

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get('/records/report', {
          params: filters
        })
        response.data.map((row: Row) => {
          row.cost_center = capitalize(row.cost_center)
          row.collaborator = capitalize(row.collaborator)
          row.type = capitalize(row.type)
          row.company = capitalize(row.company)
          row.schedule = capitalize(row.schedule)
          row.count = Number(row.count)
          return row
        })

        setData(response.data)
        setLoading(false)
        setError(false)
      } catch (err) {
        setLoading(false)
        setError(true)
      }
    }

    if (loading) {
      loadData()
    }
  }, [loading, filters])

  const handleOpenFilter = useCallback(() => {
    filterRef.current?.toggleModal(true)
  }, [])

  const handleExport = useCallback(async () => {
    if (!data || data.length === 0) {
      addToast({
        type: 'info',
        title: 'Download não disponível',
        description: 'Não existe dados, favor verifique os parâmetros.'
      })
      return
    }
    try {
      const { data } = await api.get('/records/report/export', {
        responseType: 'blob',
        params: filters
      })
      const downloadUrl = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', 'rateio.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro na exportação',
        description: err
      })
    }
  }, [addToast, data, filters])

  const handleSaveSender = useCallback(data => {
    filterRef.current?.toggleModal(false)
    !data.initial_date && delete data.initial_date
    !data.final_date && delete data.final_date
    !data.reader && delete data.reader
    !data.type && delete data.type
    if (data.initial_date) data.initial_date += 'T00:00'
    if (data.final_date) data.final_date += 'T23:59'
    setFilters(data)
    setLoading(true)
  }, [])

  const handleResetForm = useCallback(() => {
    formRef.current?.reset()
  }, [])

  const loadReaders = useCallback(async search => {
    const params = search && { name: search }
    const response = await api.get<Reader[]>('/readers', {
      params
    })

    return response.data.map(reader => ({
      value: reader.id,
      label: capitalize(reader.name)
    }))
  }, [])

  return (
    <Container>
      <Header>
        <h1>Relatórios</h1>
        <div>
          <Button onClick={handleOpenFilter} color="medium-outline">
            <BiFilterAlt size={24} />
            <span className="hide-lg-down">Filtrar</span>
          </Button>
          <Button onClick={handleExport}>
            <BiExport size={24} />
            <span className="hide-lg-down">Exportar</span>
          </Button>
        </div>
      </Header>
      <Box>
        <Table columns={columns} data={data} loading={loading} error={error} />
      </Box>
      <Filters ref={filterRef} title="Filtros">
        <Form ref={formRef} onSubmit={handleSaveSender}>
          <ScrollArea>
            <Input label="Data Inicial" name="initial_date" type="date" />
            <Input label="Data Final" name="final_date" type="date" />
            <AsyncSelect
              label="Local"
              name="reader"
              placeholder="Selecione o local"
              defaultOptions
              cacheOptions={true}
              loadOptions={loadReaders}
            />
            <Select
              label="Tipo"
              name="type"
              placeholder="Selecione o tipo"
              options={[
                { value: 'entrada', label: 'Entrada' },
                { value: 'saida', label: 'Saída' }
              ]}
              isSearchable={false}
            />
          </ScrollArea>
          <Buttons>
            <Button size="big" type="submit" color="secondary">
              Aplicar Filtro
            </Button>

            <Button size="big" color="primary" onClick={handleResetForm}>
              Limpar Filtro
            </Button>
          </Buttons>
        </Form>
      </Filters>
    </Container>
  )
}

export default Reports
