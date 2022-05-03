import { FormHandles } from '@unform/core'
import React, { useEffect, useCallback } from 'react'
import { BiSave, BiX } from 'react-icons/bi'
import SimpleBar from 'simplebar-react'
import * as Yup from 'yup'

import { Button, AsyncSelect, Form, Input } from '../../../components'
import { useLoading, useToast } from '../../../providers'
import { api } from '../../../services'
import { capitalize, getValidationErrors } from '../../../utils'
import { Row } from './styles'

import 'simplebar/dist/simplebar.min.css'

interface Role {
  id: string
  name: string
  description: string
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

export const RoleForm: React.FC<Props> = ({ id, onClose, formRef }) => {
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  useEffect(() => {
    async function loadData() {
      try {
        loadStart()
        const response = await api.get(`/roles/${id}`)
        response.data.name = capitalize(response.data.name)
        response.data.description = capitalize(response.data.description)
        response.data.permissions = response.data.permissions.map(
          (permission: Permission) => ({
            value: permission.id,
            label: capitalize(permission.name)
          })
        )
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
    async (data: Role) => {
      try {
        loadStart()

        const schema = Yup.object().shape({
          name: Yup.string().required('O nome é obrigatório'),
          description: Yup.string().required('A descrição é obrigatória'),
          permissions: Yup.array().required('As permissões são obrigatórias')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        if (id) {
          await api.put(`/roles/${id}`, data)
        } else {
          await api.post('/roles', data)
        }

        addToast({
          type: 'success',
          title: `Grupo ${id ? 'alterado' : 'cadastrado'}`,
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

  const loadPermissions = useCallback(async (search: string) => {
    const response = await api.get<Permission[]>('/permissions', {
      params: { name: search, per_page: 999 }
    })

    return response.data.map(permission => ({
      value: permission.id,
      label: capitalize(permission.name)
    }))
  }, [])

  return (
    <>
      <header>
        <h2>{!id ? 'Criar' : 'Alterar'} grupo</h2>
      </header>
      <SimpleBar style={{ maxHeight: '50vh' }}>
        <Form ref={formRef} onSubmit={handleSaveSender}>
          <Row>
            <Input label="Nome" name="name" disabled={!!id} />
            <Input label="Descrição" name="description" />
          </Row>
          <AsyncSelect
            label="Permissões"
            name="permissions"
            placeholder="Selecione a permissão"
            defaultOptions
            cacheOptions={false}
            isMulti={true}
            loadOptions={loadPermissions}
          />
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
