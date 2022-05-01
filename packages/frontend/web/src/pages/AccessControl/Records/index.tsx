import { FormHandles } from '@unform/core'
import React, { useCallback, useRef, useState } from 'react'
import { BiFilterAlt } from 'react-icons/bi'

import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Filters, { FilterHandles } from '../../../components/Filters'
import { AsyncSelect, Form, Input, Select } from '../../../components/Form'
import Header from '../../../components/Header'
import PaginatedTable from '../../../components/PaginatedTable'
import api from '../../../services/axios'
import usePaginatedRequest from '../../../services/usePaginatedRequest'
import theme from '../../../styles/theme'
import capitalize from '../../../utils/capitalize'
import getTypeColor from '../../../utils/getTypeColor'
import { Container, ScrollArea, Buttons } from './styles'

interface Record {
  id: string
  event: string
  date: string
  reader: {
    name: string
  }
  card: {
    user: {
      name: string
      type: string
    }
  }
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

const Records: React.FC = () => {
  const filterRef = useRef<FilterHandles>(null)
  const formRef = useRef<FormHandles>(null)
  const [filters, setFilters] = useState(null)

  const request = usePaginatedRequest<Record[]>({
    url: `/records`,
    params: filters
  })

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

  const handleOpenFilter = useCallback(() => {
    request.resetPage()
    filterRef.current?.toggleModal(true)
  }, [request])

  const handleResetForm = useCallback(() => {
    formRef.current?.reset()
  }, [])

  const handleSaveSender = useCallback(data => {
    filterRef.current?.toggleModal(false)
    !data.initial_date && delete data.initial_date
    !data.final_date && delete data.final_date
    !data.reader && delete data.reader
    !data.name && delete data.name
    !data.type && delete data.type
    if (data.initial_date) data.initial_date += 'T00:00'
    if (data.final_date) data.final_date += 'T23:59'
    setFilters(data)
  }, [])

  return (
    <Container>
      <Header>
        <h1>Registros</h1>
        <div>
          <Button onClick={handleOpenFilter} color="medium-outline">
            <BiFilterAlt size={24} />
            <span className="hide-lg-down">Filtrar</span>
          </Button>
        </div>
      </Header>
      <Box>
        <PaginatedTable request={request}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Horário</th>
              <th>Evento</th>
              <th>Local</th>
            </tr>
          </thead>
          <tbody>
            {request.data?.map(record => (
              <tr key={record.id}>
                <td>{capitalize(record.card.user.name)}</td>
                <td
                  style={{
                    color: theme.colors.light,
                    backgroundColor: getTypeColor(record.card.user.type)
                  }}
                >
                  {capitalize(record.card.user.type)}
                </td>
                <td>{new Date(record.date).toLocaleString()}</td>
                <td
                  style={{
                    color: theme.colors.light,
                    backgroundColor: getTypeColor(record.event)
                  }}
                >
                  {capitalize(record.event)}
                </td>
                <td>{capitalize(record.reader.name)}</td>
              </tr>
            ))}
          </tbody>
        </PaginatedTable>
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
            <Input label="Nome" name="name" />
            <Select
              label="Tipo"
              name="type"
              placeholder="Selecione o tipo"
              options={[
                { value: 'visitante', label: 'Visitante' },
                {
                  value: 'funcionario',
                  label: 'Funcionario'
                },
                { value: 'terceirizado', label: 'Terceirizado' },
                { value: 'diretor', label: 'Diretor' },
                { value: 'motorista', label: 'Motorista' }
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

export default Records
