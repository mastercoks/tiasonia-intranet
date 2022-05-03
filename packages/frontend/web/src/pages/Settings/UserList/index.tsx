import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef, useState } from 'react'
import { BiEditAlt, BiFilterAlt, BiPlus } from 'react-icons/bi'

import {
  Box,
  Button,
  Filters,
  FilterHandles,
  Input,
  Header,
  Modal,
  PaginatedTable
} from '../../../components'
import { usePaginatedRequest } from '../../../services'
import { theme } from '../../../styles'
import { capitalize, getTypeColor } from '../../../utils'
import { UserForm } from '../UserForm'
import { Container, ScrollArea, Buttons } from './styles'

interface User {
  id: string
  name: string
  login: string
  active: boolean
}

interface IFilters {
  name?: string
  login?: string
}

export const UserList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false)
  const [filters, setFilters] = useState<IFilters>({})
  const [userId, setUserId] = useState('')
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
    request.mutate()
  }, [request])

  const handleOpenModal = useCallback((id = '') => {
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

  const handleFilter = useCallback((data: IFilters) => {
    filterRef.current?.toggleModal(false)
    !data.name && delete data.name
    !data.login && delete data.login
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
              <th>Login</th>
              <th>Situação</th>
              <th style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {request.data?.map((user: User) => (
              <tr key={user.id}>
                <td className={!user.active ? 'inactive' : ''}>
                  {capitalize(user.name)}
                </td>
                <td>{user.login}</td>
                <td
                  style={{
                    color: theme.colors.light,
                    backgroundColor: getTypeColor(
                      user.active ? 'ativo' : 'inativo'
                    )
                  }}
                >
                  {user.active ? 'Ativo' : 'Inativo'}
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
            <Input label="Login" name="login" />
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
