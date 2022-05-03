import { FormHandles } from '@unform/core'
import React, { useEffect, useCallback } from 'react'
import { BiSave, BiX } from 'react-icons/bi'
import SimpleBar from 'simplebar-react'
import * as Yup from 'yup'

import { AsyncSelect, Form, Input, Select, Button } from '../../../components'
import { useLoading, useToast } from '../../../providers'
import { api } from '../../../services'
import { capitalize, getValidationErrors } from '../../../utils'
import { Row } from './styles'

import 'simplebar/dist/simplebar.min.css'

interface User {
  id: string
  name: string
  login?: string
  password?: string
  confirm_password?: string
  active: boolean
  roles: string[]
}

interface Permission {
  id: string
  name: string
  description: string
}

interface Props {
  id?: string | null
  formRef: React.RefObject<FormHandles>
  onClose: () => void
}

const activeOptions = [
  { value: true, label: 'Ativo' },
  { value: false, label: 'Bloqueado' }
]

export const UserForm: React.FC<Props> = ({ id, onClose, formRef }) => {
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  useEffect(() => {
    async function loadData() {
      try {
        loadStart()
        const response = await api.get(`/users/${id}`)
        response.data.name = capitalize(response.data.name)
        response.data.roles = response.data.roles.map(
          (permission: Permission) => ({
            value: permission.id,
            label: capitalize(permission.name)
          })
        )
        response.data.password = ''
        response.data.confirm_password = ''
        formRef.current?.setData(response.data)
        loadFinish()
      } catch (err) {
        loadFinish()
        addToast({
          type: 'error',
          title: `Erro ${id ? 'na alteração' : 'no cadastro'}`,
          description: String(err)
        })
      }
    }

    if (id) {
      loadData()
    }
  }, [id, formRef, addToast, loadStart, loadFinish])

  const handleSaveSender = useCallback(
    async (data: User) => {
      try {
        loadStart()
        const schema = Yup.object().shape({
          name: Yup.string().required('O nome é obrigatório'),
          login: Yup.string().required('O login é obrigatório'),
          active: Yup.boolean().required('A situação é obrigatória'),
          password: Yup.string().test(
            'min-password',
            'A senha precisa ter pelo menos 6 caracteres',
            value => value == null || value.length === 0 || value.length >= 6
          ),
          confirm_password: Yup.string()
            .test(
              'min-password',
              'A senha precisa ter pelo menos 6 caracteres',
              value => value == null || value.length === 0 || value.length >= 6
            )
            .oneOf([Yup.ref('password'), undefined], 'Senhas não são iguais')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        !data.password && delete data.password
        delete data.confirm_password

        if (id) {
          delete data.login
          await api.put(`/users/${id}`, data)
        } else {
          await api.post('/users', data)
        }
        addToast({
          type: 'success',
          title: `Usuário ${id ? 'alterado' : 'cadastrado'}`,
          description: `${data.name} foi ${
            id ? 'alterado' : 'cadastrado'
          } com sucesso.`
        })
        onClose()
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
          description: String(err)
        })
      }
    },
    [id, addToast, formRef, onClose, loadStart, loadFinish]
  )

  const loadRoles = useCallback(async (search: string) => {
    const response = await api.get<Permission[]>('/roles', {
      params: { name: search, per_page: 999 }
    })

    return response.data.map((permission: Permission) => ({
      value: permission.id,
      label: capitalize(permission.name)
    }))
  }, [])

  return (
    <>
      <header>
        <h2>{!id ? 'Criar' : 'Alterar'} usuário</h2>
      </header>
      <SimpleBar style={{ maxHeight: '50vh' }}>
        <Form ref={formRef} onSubmit={handleSaveSender}>
          <Row>
            <Input label="Nome" name="name" />
            <Input label="Login" name="login" disabled={!!id} />
            <Input
              label="Senha"
              name="password"
              type="password"
              autoComplete="new-password"
            />
            <Input
              label="Confime a Senha"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
            />
            <Select
              label="Situação"
              name="active"
              placeholder="Selecione a situação"
              defaultValue={activeOptions[0]}
              options={activeOptions}
            />
            <AsyncSelect
              className="last"
              label="Grupos"
              name="roles"
              placeholder="Selecione o grupo"
              defaultOptions
              cacheOptions={false}
              isMulti={true}
              loadOptions={loadRoles}
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
