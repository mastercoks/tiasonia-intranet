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
import capitalize from '../../../utils/capitalize'
import getValidationErrors from '../../../utils/getValidationErrors'
import { Row } from './styles'

import 'simplebar/dist/simplebar.min.css'

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

interface Props {
  id?: string | null
  formRef: React.RefObject<FormHandles>
  onClose: () => void
}

const ReaderForm: React.FC<Props> = ({ id, onClose, formRef }) => {
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  useEffect(() => {
    async function loadData() {
      try {
        loadStart()
        const response = await api.get(`/readers/${id}`)
        response.data.name = capitalize(response.data.name)
        response.data.type = {
          value: response.data.type.id,
          label: capitalize(response.data.type.name)
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
    async (data: Reader) => {
      try {
        loadStart()

        const schema = Yup.object().shape({
          name: Yup.string().required('O nome é obrigatório'),
          ip_address: Yup.string().required('A descrição é obrigatória'),
          type: Yup.string().required('O tipo é obrigatório')
        })

        await schema.validate(data, {
          abortEarly: false
        })
        if (id) {
          await api.put(`/readers/${id}`, data)
        } else {
          await api.post('/readers', data)
        }
        addToast({
          type: 'success',
          title: `Leitor ${id ? 'alterado' : 'cadastrado'}`,
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

  const loadReaderTypes = useCallback(async search => {
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
    <>
      <header>
        <h2>{!id ? 'Criar' : 'Alterar'} leitor</h2>
      </header>
      <SimpleBar style={{ maxHeight: '50vh' }}>
        <Form ref={formRef} onSubmit={handleSaveSender}>
          <Row>
            <Input label="Nome" name="name" />
            <Input label="Endereço IP" name="ip_address" type="ip" />
            <AsyncSelect
              label="Tipo"
              name="type"
              placeholder="Selecione o tipo"
              defaultOptions
              cacheOptions={false}
              loadOptions={loadReaderTypes}
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

export default ReaderForm
