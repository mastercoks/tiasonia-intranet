import { FormHandles } from '@unform/core'
import React, { useEffect, useCallback } from 'react'
import { BiSave, BiX } from 'react-icons/bi'
import SimpleBar from 'simplebar-react'
import getValidationErrors from 'utils/getValidationErrors'
import * as Yup from 'yup'

import Button from '../../../components/Button'
import { Form, Input } from '../../../components/Form'
import { useLoading } from '../../../providers/loading'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import capitalize from '../../../utils/capitalize'

import 'simplebar/dist/simplebar.min.css'

interface ReaderType {
  id: string
  name: string
}

interface Props {
  id?: string | null
  formRef: React.RefObject<FormHandles>
  onClose: () => void
}

const ReaderTypeForm: React.FC<Props> = ({ id, onClose, formRef }) => {
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  useEffect(() => {
    async function loadData() {
      try {
        loadStart()
        const response = await api.get(`/types/${id}`)
        response.data.name = capitalize(response.data.name)
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
    async (data: ReaderType) => {
      try {
        loadStart()

        const schema = Yup.object().shape({
          name: Yup.string().required('O nome é obrigatório')
        })

        await schema.validate(data, {
          abortEarly: false
        })
        if (id) {
          await api.put(`/types/${id}`, data)
        } else {
          await api.post('/types', data)
        }

        addToast({
          type: 'success',
          title: `Tipo ${id ? 'alterado' : 'cadastrado'}`,
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

  return (
    <>
      <header>
        <h2>{!id ? 'Criar' : 'Alterar'} tipo de leitor</h2>
      </header>
      <SimpleBar style={{ maxHeight: '50vh' }}>
        <Form ref={formRef} onSubmit={handleSaveSender}>
          <Input label="Nome" name="name" />
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

export default ReaderTypeForm
