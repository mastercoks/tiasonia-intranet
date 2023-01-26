import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef, useState } from 'react'
import { BiExport, BiFilterAlt, BiStopCircle, BiSync } from 'react-icons/bi'

import {
  Box,
  Header,
  PaginatedTable,
  Button,
  FilterHandles,
  Filters,
  AsyncSelect,
  Modal
} from '../../../components'
import { useToast } from '../../../providers'
import { api, usePaginatedRequest } from '../../../services'
import { capitalize, formatCNPJ } from '../../../utils'
import { ConflictForm } from '../ConflictForm'
import { Buttons, Container, ScrollArea } from './styles'

interface Conflict {
  id: string
  code: string
  name: string
  cnpj: string
  code_salesman: string
  name_salesman: string
  code_coordinator: string
  name_coordinator: string
  protheus: boolean
  simple_national: boolean
}

interface ConflictExecution {
  id: string
  running: boolean
  uf: string
  url: string
  conflicts: Array<Conflict>
}

interface Execution {
  id: string
  running: boolean
  uf: string
  url: string
  updated_at: Date
}

interface IFilters {
  execution_id?: string
}

export const ConflictList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false)
  const [filters, setFilters] = useState<IFilters>({})
  const filterRef = useRef<FilterHandles>(null)
  const formRef = useRef<FormHandles>(null)

  const { addToast } = useToast()

  const request = usePaginatedRequest<ConflictExecution>({
    url: '/conflicts',
    params: filters
  })

  const handleCloseModal = useCallback(() => {
    formRef.current?.setErrors({})
    formRef.current?.reset()
    setFilters({})
    setOpenModal(false)
    request.mutate()
  }, [request])

  const handleOpenModal = useCallback(() => {
    setOpenModal(true)
  }, [])

  const handleSync = useCallback(async () => {
    if (request.data?.running) {
      addToast({
        type: 'info',
        title: 'Sincronização não finalizada',
        description: 'Existe uma sincronização em andamento.'
      })
      return
    }
    handleOpenModal()
  }, [request, addToast, handleOpenModal])

  const handleStopSync = useCallback(async () => {
    if (!request.data?.running) {
      addToast({
        type: 'info',
        title: 'Sincronização finalizada',
        description: 'Não existe uma sincronização em andamento.'
      })
      return
    }
    try {
      await api.get('/conflicts/stop')
      addToast({
        type: 'info',
        title: 'Sincronização interrompida',
        description: 'Tente iniciar uma nova sincronização.'
      })
      request.mutate()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro na sincronização',
        description: String(err)
      })
    }
  }, [request, addToast])

  const handleExport = useCallback(async () => {
    if (!request.data?.url) {
      addToast({
        type: 'info',
        title: 'Download não disponível',
        description: 'Espere a sincronização finalizar.'
      })
      return
    }
    try {
      const { data } = await api.get(request.data?.url, {
        responseType: 'blob'
      })
      const downloadUrl = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', `conflitos_${request.data?.uf}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro na exportação',
        description: String(err)
      })
    }
  }, [request, addToast])

  const handleOpenFilter = useCallback(() => {
    request.resetPage()
    filterRef.current?.toggleModal(true)
  }, [request])

  const handleResetForm = useCallback(() => {
    formRef.current?.reset()
  }, [])

  const handleFilter = useCallback((data: IFilters) => {
    filterRef.current?.toggleModal(false)
    !data.execution_id && delete data.execution_id
    setFilters(data)
  }, [])

  const loadExecutions = useCallback(async () => {
    const response = await api.get<Execution[]>('/executions', {
      params: { per_page: 999 }
    })

    return response.data.map(permission => ({
      value: permission.id,
      label: `${permission.uf} - ${new Date(
        permission.updated_at
      ).toLocaleString()}`
    }))
  }, [])

  return (
    <Container>
      <Header>
        <h1>Conflitos de cadastro</h1>
        <div>
          <Button onClick={handleOpenFilter} color="medium-outline">
            <BiFilterAlt size={24} />
            <span className="hide-lg-down">Filtrar</span>
          </Button>
          <Button
            color="medium-outline"
            onClick={handleExport}
            disabled={request.data && !request.data?.url}
          >
            <BiExport size={24} />
            <span className="hide-lg-down">Exportar</span>
          </Button>
          <Button
            color="primary"
            onClick={handleSync}
            disabled={request.data && request.data?.running}
          >
            <BiSync
              size={24}
              className={request.data && request.data?.running ? 'rotate' : ''}
            />
            <span className="hide-lg-down">Sincronizar</span>
          </Button>
          <Button
            color="primary"
            onClick={handleStopSync}
            disabled={!request.data?.running}
          >
            <BiStopCircle size={24} />
            <span className="hide-lg-down">Parar</span>
          </Button>
        </div>
      </Header>
      <Box>
        <PaginatedTable request={request} dataAlt={request.data?.conflicts}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CNPJ</th>
              <th>Vendedor</th>
              <th>Coordenador</th>
              <th>Cadastro Protheus</th>
              <th>Simples Nacional</th>
            </tr>
          </thead>
          <tbody>
            {request.data &&
              request.data?.conflicts.map(conflict => {
                return (
                  <tr key={conflict.id}>
                    <td>{capitalize(conflict.name)}</td>
                    <td>{formatCNPJ(conflict.cnpj)}</td>
                    <td>{capitalize(conflict.name_salesman)}</td>
                    <td>{capitalize(conflict.name_coordinator)}</td>
                    <td>{conflict.protheus ? 'Sim' : 'Não'}</td>
                    <td>{conflict.simple_national ? 'Sim' : 'Não'}</td>
                  </tr>
                )
              })}
          </tbody>
        </PaginatedTable>
      </Box>
      <Filters ref={filterRef} title="Filtros">
        <Form ref={formRef} onSubmit={handleFilter}>
          <ScrollArea>
            <AsyncSelect
              label="Consultas"
              name="execution_id"
              placeholder="Selecione uma consulta"
              defaultOptions
              cacheOptions={false}
              isSearchable={false}
              loadOptions={loadExecutions}
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
      {openModal && (
        <Modal open={openModal} onClose={handleCloseModal} size="sm">
          <ConflictForm onClose={handleCloseModal} formRef={formRef} />
        </Modal>
      )}
    </Container>
  )
}
