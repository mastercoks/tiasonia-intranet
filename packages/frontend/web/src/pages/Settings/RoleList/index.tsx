import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef, useState } from 'react'
import { BiEditAlt, BiFilterAlt, BiPlus } from 'react-icons/bi'

import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Filters, { FilterHandles } from '../../../components/Filters'
import { Input } from '../../../components/Form'
import Header from '../../../components/Header'
import Modal from '../../../components/Modal'
import PaginatedTable from '../../../components/PaginatedTable'
import usePaginatedRequest from '../../../services/usePaginatedRequest'
import capitalize from '../../../utils/capitalize'
import RoleForm from '../RoleForm'
import { Container, ScrollArea, Buttons } from './styles'

interface Role {
  id: string
  name: string
  description: string
}

const RoleList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false)
  const [filters, setFilters] = useState(null)
  const [roleId, setRoleId] = useState(null)
  const filterRef = useRef<FilterHandles>(null)
  const formRef = useRef<FormHandles>(null)

  const request = usePaginatedRequest<Role[]>({
    url: `/roles`,
    params: filters
  })

  const handleCloseModal = useCallback(() => {
    formRef.current?.setErrors({})
    formRef.current?.reset()
    setOpenModal(false)
    request.revalidate()
  }, [request])

  const handleOpenModal = useCallback((id = undefined) => {
    setRoleId(id)
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
    !data.description && delete data.description
    setFilters(data)
  }, [])

  return (
    <Container>
      <Header>
        <h1>Grupos</h1>
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
              <th>Descrição</th>
              <th style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {request.data?.map(role => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>{capitalize(role.description)}</td>
                <td className="button">
                  <Button
                    color="primary-outline"
                    size="small"
                    onClick={() => handleOpenModal(role.id)}
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
            <Input label="Descrição" name="description" />
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
          <RoleForm id={roleId} onClose={handleCloseModal} formRef={formRef} />
        </Modal>
      )}
    </Container>
  )
}

export default RoleList
