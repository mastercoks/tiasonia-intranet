import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { useToast } from 'providers/toast'
import React, { useCallback, useRef, useState } from 'react'
import { BiEditAlt, BiFilterAlt, BiPlus, BiMailSend } from 'react-icons/bi'
import api from 'services/axios'

import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Filters, { FilterHandles } from '../../../components/Filters'
import { Input } from '../../../components/Form'
import Header from '../../../components/Header'
import Modal from '../../../components/Modal'
import PaginatedTable from '../../../components/PaginatedTable'
import usePaginatedRequest from '../../../services/usePaginatedRequest'
import capitalize from '../../../utils/capitalize'
import ContactForm from '../ContactForm'
import { Buttons, Container, ScrollArea } from './styles'

interface Contact {
  id: string
  name: string
  email: string
  confirm: boolean
  user?: User
}

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
const ContactList: React.FC = () => {
  const filterRef = useRef<FilterHandles>(null)
  const formRef = useRef<FormHandles>(null)
  const formFilterRef = useRef<FormHandles>(null)
  const [filters, setFilters] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [contactId, setContactId] = useState(null)
  const { addToast } = useToast()

  const request = usePaginatedRequest<Contact[]>({
    url: `/contacts`,
    params: filters
  })

  const handleCloseModal = useCallback(() => {
    formRef.current?.setErrors({})
    formRef.current?.reset()
    setOpenModal(false)
    request.revalidate()
  }, [request])

  const navigateToCreate = useCallback((id = undefined) => {
    setContactId(id)
    setOpenModal(true)
  }, [])

  const handleResetPassword = useCallback(
    (id: string) => {
      try {
        api.get(`/contacts/${id}/reset`)
        addToast({
          type: 'success',
          title: 'Email enviado',
          description: 'Foi enviado um email para recuperar a senha'
        })
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na recuperação da senha',
          description: err
        })
      }
    },
    [addToast]
  )

  const handleOpenFilter = useCallback(() => {
    request.resetPage()
    filterRef.current?.toggleModal(true)
  }, [request])

  const handleResetForm = useCallback(() => {
    formFilterRef.current?.reset()
  }, [])

  const handleSaveSender = useCallback(data => {
    filterRef.current?.toggleModal(false)
    !data.name && delete data.name
    !data.email && delete data.email
    !data.user && delete data.user
    setFilters(data)
  }, [])

  return (
    <Container>
      <Header>
        <h1>Contatos</h1>
        <div>
          <Button onClick={handleOpenFilter} color="medium-outline">
            <BiFilterAlt size={24} />
            <span className="hide-lg-down">Filtrar</span>
          </Button>
          <Button onClick={() => navigateToCreate()}>
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
              <th>Email</th>
              <th>Usuário</th>
              <th style={{ width: 32 }} />
              <th style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {request.data?.map(contact => (
              <tr key={contact.id}>
                <td className={!contact.confirm ? 'inactive' : ''}>
                  {capitalize(contact.name)}
                </td>
                <td>{contact.email}</td>
                <td>{capitalize(contact.user?.name || '')}</td>
                <td className="button">
                  <Button
                    color="primary-outline"
                    size="small"
                    onClick={() => navigateToCreate(contact.id)}
                  >
                    <BiEditAlt size={20} />
                    <span className="hide-lg-down">Editar</span>
                  </Button>
                </td>
                <td className="button">
                  <Button
                    color="primary-outline"
                    size="small"
                    onClick={() => handleResetPassword(contact.id)}
                  >
                    <BiMailSend size={20} />
                    <span className="hide-lg-down">Resetar</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </PaginatedTable>
      </Box>
      <Filters ref={filterRef} title="Filtros">
        <Form ref={formFilterRef} onSubmit={handleSaveSender}>
          <ScrollArea>
            <Input label="Nome" name="name" />
            <Input label="Email" name="email" />
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
          <ContactForm
            id={contactId}
            onClose={handleCloseModal}
            formRef={formRef}
            request={request}
          />
        </Modal>
      )}
    </Container>
  )
}

export default ContactList
