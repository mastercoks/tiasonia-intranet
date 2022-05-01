import { FormHandles } from '@unform/core'
import React, { useEffect, useCallback } from 'react'
import { BiSave, BiX } from 'react-icons/bi'
import SimpleBar from 'simplebar-react'
import * as Yup from 'yup'

import Button from '../../../components/Button'
import {
  AsyncSelect,
  CreatableSelect,
  Form,
  Input,
  Select
} from '../../../components/Form'
import { useLoading } from '../../../providers/loading'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import capitalize from '../../../utils/capitalize'
import getValidationErrors from '../../../utils/getValidationErrors'
import isValidCPF from '../../../utils/isValidCPF'
import { Row } from './styles'

import 'simplebar/dist/simplebar.min.css'

interface Collaborator {
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
}

const activeOptions = [
  { value: true, label: 'Ativo' },
  { value: false, label: 'Bloqueado' }
]

const typeOptions = [
  { value: 'visitante', label: 'Visitante' },
  {
    value: 'funcionario',
    label: 'Funcionario',
    isDisabled: true
  },
  { value: 'terceirizado', label: 'Terceirizado' },
  { value: 'diretor', label: 'Diretor' },
  { value: 'motorista', label: 'Motorista' }
]

const CollaboratorForm: React.FC<Props> = ({ id, onClose, formRef }) => {
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  useEffect(() => {
    async function loadData() {
      loadStart()
      const response = await api.get(`/users/${id}`)
      response.data.name = capitalize(response.data.name)
      response.data.company = {
        value: response.data.company,
        label: capitalize(response.data.company)
      }
      response.data.cost_center = {
        value: response.data.cost_center.id,
        label: capitalize(response.data.cost_center.name)
      }
      formRef.current?.setData(response.data)
      loadFinish()
    }
    if (id) {
      loadData()
    }
  }, [id, formRef, loadStart, loadFinish])

  const handleSaveSender = useCallback(
    async (data: Collaborator) => {
      try {
        loadStart()
        const schema = Yup.object().shape({
          name: Yup.string().required('O nome é obrigatório'),
          cpf: Yup.string()
            .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Digite apenas números')
            .test('is-valid-cpf', 'CPF precisa ser válido', isValidCPF)
            .required('O cpf é obrigatório'),
          email: Yup.string().email('Email precisa ser válido'),
          active: Yup.string().required('Situação é obrigatória'),
          type: Yup.string().required('O tipo é obrigatório'),
          company: Yup.string().required('A empresa é obrigatória'),
          cost_center: Yup.string().required('O centro de custo é obrigatório')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        data.cpf = data.cpf.replace(/[^\d]+/g, '')
        if (id) {
          await api.put(`/users/${id}`, data)
        } else {
          await api.post('/users', data)
        }
        addToast({
          type: 'success',
          title: `Colaborador ${id ? 'alterado' : 'cadastrado'}`,
          description: `${data.name} foi ${
            id ? 'alterado' : 'cadastrado'
          } com sucesso.`
        })
        loadFinish()
        onClose()
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
    const response = await api.get<Collaborator[]>('/companies', {
      params: { company: search }
    })

    return response.data.map(user => ({
      value: user.company,
      label: capitalize(user.company)
    }))
  }, [])

  const loadCostCenters = useCallback(async search => {
    const response = await api.get<CostCenter[]>('/costCenters', {
      params: { name: search }
    })

    return response.data.map(costCenter => ({
      value: costCenter.id,
      label: capitalize(costCenter.name)
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
            <Input label="Nome" name="name" />
            <Input
              mask="999.999.999-99"
              label="Cpf"
              name="cpf"
              disabled={!!id}
            />
            <Select
              label="Situação"
              name="active"
              placeholder="Selecione a situação"
              defaultValue={activeOptions[0]}
              options={activeOptions}
              isDisabled={!id}
            />
            <Select
              label="Tipo"
              name="type"
              placeholder="Selecione o tipo"
              options={typeOptions}
              menuPlacement="auto"
            />
            <CreatableSelect
              label="Empresa"
              name="company"
              placeholder="Selecione a empresa"
              defaultOptions
              loadOptions={loadCompanies}
            />
            <AsyncSelect
              label="Centro de Custo"
              name="cost_center"
              placeholder="Selecione o tipo"
              defaultOptions
              loadOptions={loadCostCenters}
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

export default CollaboratorForm
