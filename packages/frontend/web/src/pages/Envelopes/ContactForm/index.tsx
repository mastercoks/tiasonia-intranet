import { FormHandles } from '@unform/core'
import React, { useEffect, useCallback } from 'react'
import { BiSave, BiX } from 'react-icons/bi'
import SimpleBar from 'simplebar-react'
import * as Yup from 'yup'

import Button from '../../../components/Button'
import { AsyncSelect, Form, Input } from '../../../components/Form'
import { useLoading } from '../../../providers/loading'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import { PaginatedRequest } from '../../../services/usePaginatedRequest'
import capitalize from '../../../utils/capitalize'
import getValidationErrors from '../../../utils/getValidationErrors'
import { Row } from './styles'
import 'simplebar/dist/simplebar.min.css'

interface Contact {
  id: string
  name: string
  email: string
  user?: User
}

interface User {
  id: string
  name: string
  cpf: string
  email: string
  type?: string
  company: string
  cost_center: CostCenter
}

interface CostCenter {
  id: string
  name: string
}

interface Props {
  id: string | null
  formRef: React.RefObject<FormHandles>
  onClose: () => void
  request: PaginatedRequest<any, unknown>
}

const ContactForm: React.FC<Props> = ({ id, onClose, formRef, request }) => {
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  useEffect(() => {
    async function loadData() {
      loadStart()
      const response = await api.get<Contact>(`/contacts/${id}`)

      formRef.current?.setData({
        name: capitalize(response.data.name),
        email: response.data.email,
        user: {
          value: response.data.user?.id,
          label: capitalize(response.data.user?.name || '')
        }
      })
      loadFinish()
    }
    if (id) {
      loadData()
    }
  }, [id, formRef, loadStart, loadFinish])

  const handleSaveSender = useCallback(
    async (data: Contact) => {
      try {
        loadStart()

        const schema = Yup.object().shape({
          name: Yup.string().required('O nome é obrigatório'),
          email: Yup.string().email('Email precisa ser válido')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        if (id) {
          await api.put(`/contacts/${id}`, data)
        } else {
          await api.post('/contacts', data)
        }

        addToast({
          type: 'success',
          title: `Colaborador ${id ? 'alterado' : 'cadastrado'}`,
          description: `${data.name} foi ${
            id ? 'alterado' : 'cadastrado'
          } com sucesso.`
        })
        onClose()
        request.revalidate()
        loadFinish()
      } catch (err) {
        loadFinish()
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
          return
        }
        addToast({
          type: 'error',
          title: `Erro ${id ? 'na alteração' : 'no cadastro'}`,
          description: err
        })
      }
    },
    [id, addToast, formRef, onClose, request, loadStart, loadFinish]
  )

  const loadUsers = useCallback(async search => {
    const response = await api.get<Contact[]>('/users', {
      params: search ? { name: search } : ''
    })

    return response.data.map(user => ({
      value: user.id,
      label: capitalize(user.name)
    }))
  }, [])

  return (
    <>
      <header>
        <h2>{!id ? 'Criar' : 'Alterar'} colaborador</h2>
      </header>
      <SimpleBar style={{ maxHeight: '50vh' }}>
        <Form ref={formRef} onSubmit={handleSaveSender}>
          <Row>
            <Input label="Nome" name="name" disabled={!!isLoading} />
            <Input label="Email" name="email" disabled={!!id || !!isLoading} />
            <AsyncSelect
              label="Usuário"
              name="user"
              placeholder="Selecione um usuário"
              defaultOptions
              loadOptions={loadUsers}
              isDisabled={!!isLoading}
            />
          </Row>
        </Form>
      </SimpleBar>
      <footer>
        <Button size="big" color="primary-outline" onClick={onClose}>
          <BiX size={24} />
          <span>Cancelar</span>
        </Button>
        <Button
          loading={isLoading}
          size="big"
          onClick={() => formRef.current?.submitForm()}
        >
          <BiSave size={24} />
          <span>Salvar</span>
        </Button>
      </footer>
    </>
  )
}

export default ContactForm
