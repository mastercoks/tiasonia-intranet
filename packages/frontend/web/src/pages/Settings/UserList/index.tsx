import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef, useState } from 'react'
import { BiEditAlt, BiFilterAlt, BiPlus } from 'react-icons/bi'

import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Filters, { FilterHandles } from '../../../components/Filters'
import { Input, Select } from '../../../components/Form'
import Header from '../../../components/Header'
import Modal from '../../../components/Modal'
import PaginatedTable from '../../../components/PaginatedTable'
import usePaginatedRequest from '../../../services/usePaginatedRequest'
import theme from '../../../styles/theme'
import capitalize from '../../../utils/capitalize'
import { formatCPF } from '../../../utils/formatters'
import getTypeColor from '../../../utils/getTypeColor'
import UserForm from '../UserForm'
import { Container, ScrollArea, Buttons } from './styles'

interface User {
  id: string
  name: string
  cpf: string
  email: string
  type: string
  active: boolean
  company: string
  cost_center: CostCenter
}

interface CostCenter {
  id: string
  name: string
}

const UserList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false)
  const [filters, setFilters] = useState(null)
  const [userId, setUserId] = useState(null)
  const filterRef = useRef<FilterHandles>(null)
  const formRef = useRef<FormHandles>(null)

  const request = usePaginatedRequest<User[]>({
    url: `/users`,
    params: filters
  })

  const handleCloseModal = useCallback(() => {
    formRef.current?.setErrors({})
    formRef.current?.reset()
    setOpenModal(false)
    request.revalidate()
  }, [request])

  const handleOpenModal = useCallback((id = undefined) => {
    setUserId(id)
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
    !data.cpf && delete data.cpf
    if (data.cpf) data.cpf = data.cpf.replace(/[^\d]+/g, '')
    !data.type && delete data.type
    setFilters(data)
  }, [])

  return (
    <Container>
      <Header>
        <h1>Usuários</h1>
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
              <th>Cpf</th>
              <th>Tipo</th>
              <th style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {request.data?.map(user => (
              <tr key={user.id}>
                <td className={!user.active ? 'inactive' : ''}>
                  {capitalize(user.name)}
                </td>
                <td>{formatCPF(user.cpf)}</td>
                <td
                  style={{
                    color: theme.colors.light,
                    backgroundColor: getTypeColor(user.type)
                  }}
                >
                  {capitalize(user.type)}
                </td>
                <td className="button">
                  <Button
                    color="primary-outline"
                    size="small"
                    onClick={() => handleOpenModal(user.id)}
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
            <Input label="Cpf" name="cpf" mask="999.999.999-99" />
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
      {openModal && (
        <Modal open={openModal} onClose={handleCloseModal} size="md">
          <UserForm id={userId} onClose={handleCloseModal} formRef={formRef} />
        </Modal>
      )}
    </Container>
  )
}

export default UserList
