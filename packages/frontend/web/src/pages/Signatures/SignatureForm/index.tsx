import { FormHandles } from '@unform/core'
import React, { useEffect, useCallback } from 'react'
import { BiSave, BiX } from 'react-icons/bi'
import SimpleBar from 'simplebar-react'
import * as Yup from 'yup'

import Button from '../../../components/Button'
import { AsyncSelect, Form, Input, Select } from '../../../components/Form'
import { useLoading } from '../../../providers/loading'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import capitalize from '../../../utils/capitalize'
import getValidationErrors from '../../../utils/getValidationErrors'
import { Row } from './styles'

import 'simplebar/dist/simplebar.min.css'

interface Company {
  id: string
  name: string
  logo: string
  site: string
  group: string
  disclaimer: string
}

interface Signature {
  id: string
  name: string
  role: string
  telephone: string
  cellphone: string
  email: string
  active: boolean
  company: Company
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

const SignatureForm: React.FC<Props> = ({ id, onClose, formRef }) => {
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  useEffect(() => {
    async function loadData() {
      try {
        loadStart()
        const response = await api.get(`/signatures/${id}`)

        response.data.name = capitalize(response.data.name)
        response.data.role = capitalize(response.data.role)
        response.data.company = {
          value: response.data.company.id,
          label: capitalize(response.data.company.name)
        }
        formRef.current?.setData(response.data)
        loadFinish()
      } catch (err) {
        loadFinish()
        addToast({
          type: 'error',
          title: `Erro ${id ? 'na alteração' : 'no cadastro'}`,
          description: err
        })
      }
    }

    if (id) {
      loadData()
    }
  }, [id, formRef, addToast, loadStart, loadFinish])

  const handleSaveSender = useCallback(
    async (data: Signature) => {
      try {
        loadStart()

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          email: Yup.string()
            .email('Email precisa ser válido')
            .required('Email é obrigatório'),
          role: Yup.string().required('Cargo é obrigatório'),
          telephone: Yup.string().required('Telefone é obrigatório'),
          active: Yup.string().required('Situação é obrigatória'),
          company: Yup.string().required('Empresa é obrigatória')
        })

        await schema.validate(data, {
          abortEarly: false
        })
        if (id) {
          await api.put(`/signatures/${id}`, data)
        } else {
          await api.post('/signatures', data)
        }
        addToast({
          type: 'success',
          title: `Colaborador ${id ? 'alterado' : 'cadastrado'}`,
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
          description: err
        })
      }
    },
    [id, addToast, formRef, onClose, loadStart, loadFinish]
  )

  const loadCompanies = useCallback(async search => {
    const response = await api.get<Company[]>('/signatures/companies', {
      params: { name: search || '' }
    })

    return response.data.map(company => ({
      value: company.id,
      label: capitalize(company.name)
    }))
  }, [])

  return (
    <>
      <header>
        <h2>{!id ? 'Criar' : 'Alterar'} assinatura</h2>
      </header>
      <SimpleBar style={{ maxHeight: '50vh' }}>
        <Form ref={formRef} onSubmit={handleSaveSender}>
          <Row>
            <Input label="Email" name="email" disabled={!!id} />
            <Select
              label="Situação"
              name="active"
              placeholder="Selecione a situação"
              defaultValue={activeOptions[0]}
              options={activeOptions}
              isDisabled={!id}
            />
            <Input label="Nome" name="name" />
            <Input label="Cargo" name="role" />
            <Input label="Telefone" name="telephone" type="tel" />
            <Input label="Celular" name="cellphone" type="tel" />
            <AsyncSelect
              label="Empresa"
              name="company"
              placeholder="Selecione a empresa"
              defaultOptions
              loadOptions={loadCompanies}
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

export default SignatureForm
