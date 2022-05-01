import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef, useState } from 'react'
import { BiEditAlt, BiFilterAlt, BiPlus } from 'react-icons/bi'

import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Filters, { FilterHandles } from '../../../components/Filters'
import { AsyncSelect, Input } from '../../../components/Form'
import Header from '../../../components/Header'
import Modal from '../../../components/Modal'
import PaginatedTable from '../../../components/PaginatedTable'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import usePaginatedRequest from '../../../services/usePaginatedRequest'
import theme from '../../../styles/theme'
import capitalize from '../../../utils/capitalize'
import getTypeColor from '../../../utils/getTypeColor'
import ReaderForm from '../ReaderForm'
import { Container, ScrollArea, Buttons } from './styles'

interface Reader {
  id: string
  name: string
  ip_address: string
  type: ReaderType
}

interface ReaderType {
  id: string
  name: string
}

const ReaderList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false)
  const [filters, setFilters] = useState(null)
  const [readerId, setReaderId] = useState(null)
  const filterRef = useRef<FilterHandles>(null)
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()

  const request = usePaginatedRequest<Reader[]>({
    url: `/readers`,
    params: filters
  })

  const handleCloseModal = useCallback(() => {
    formRef.current?.setErrors({})
    formRef.current?.reset()
    setOpenModal(false)
    request.revalidate()
  }, [request])

  const handleOpenModal = useCallback((id = undefined) => {
    setReaderId(id)
    setOpenModal(true)
  }, [])

  const handleOpenFilter = useCallback(() => {
    request.resetPage()
    filterRef.current?.toggleModal(true)
  }, [request])

  const handleResetForm = useCallback(() => {
    formRef.current?.reset()
  }, [])

  const handleFilter = useCallback(data => {
    filterRef.current?.toggleModal(false)
    !data.name && delete data.name
    !data.ip_address && delete data.ip_address
    !data.type && delete data.type
    setFilters(data)
  }, [])

  const loadTypes = useCallback(async search => {
    const params = { name: search, per_page: 999 }
    !params.name && delete params.name
    const response = await api.get<ReaderType[]>('/types', {
      params
    })

    return response.data.map(type => ({
      value: type.id,
      label: capitalize(type.name)
    }))
  }, [])

  return (
    <Container>
      <Header>
        <h1>Leitores</h1>
        <div>
          <Button onClick={handleOpenFilter} color="medium-outline">
            <BiFilterAlt size={24} />
            <span className="hide-lg-down">Filtrar</span>
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <BiPlus size={24} />
            <span className="hide-lg-down">Novo</span>
          </Button>
        </div>
      </Header>
      <Box>
        <PaginatedTable request={request}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Endereço IP</th>
              <th>Tipo</th>
              <th style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {request.data?.map(reader => (
              <tr key={reader.id}>
                <td>{capitalize(reader.name)}</td>
                <td>{reader.ip_address}</td>
                <td
                  style={{
                    color: theme.colors.light,
                    backgroundColor: getTypeColor(reader.type.name)
                  }}
                >
                  {capitalize(reader.type.name)}
                </td>
                <td className="button">
                  <Button
                    color="primary-outline"
                    size="small"
                    onClick={() => handleOpenModal(reader.id)}
                  >
                    <BiEditAlt size={20} />
                    <span className="hide-lg-down">Alterar</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </PaginatedTable>
      </Box>
      <Filters ref={filterRef} title="Filtros">
        <Form ref={formRef} onSubmit={handleFilter}>
          <ScrollArea>
            <Input label="Nome" name="name" />
            <Input label="Endereço IP" name="ip_address" type="ip" />
            <AsyncSelect
              label="Tipo"
              name="type"
              placeholder="Selecione o tipo"
              defaultOptions
              cacheOptions={false}
              loadOptions={loadTypes}
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
        <Modal open={openModal} onClose={handleCloseModal} size="md">
          <ReaderForm
            id={readerId}
            onClose={handleCloseModal}
            formRef={formRef}
          />
        </Modal>
      )}
    </Container>
  )
}

export default ReaderList
