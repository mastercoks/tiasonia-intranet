import { FormHandles } from '@unform/core'
import React, { useCallback } from 'react'
import { BiPlay, BiX } from 'react-icons/bi'
import SimpleBar from 'simplebar-react'
import * as Yup from 'yup'

import { Button, Form, Select } from '../../../components'
import { useLoading, useToast } from '../../../providers'
import { api } from '../../../services'
import { getValidationErrors } from '../../../utils'

import 'simplebar/dist/simplebar.min.css'

interface Execution {
  uf: string
}

const ufs = [
  { label: 'Acre', value: 'AC' },
  { label: 'Alagoas', value: 'AL' },
  { label: 'Amapá', value: 'AP' },
  { label: 'Amazonas', value: 'AM' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' },
  { label: 'Espírito Santo', value: 'ES' },
  { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' },
  { label: 'Mato Grosso', value: 'MT' },
  { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Pará', value: 'PA' },
  { label: 'Paraíba', value: 'PB' },
  { label: 'Paraná', value: 'PR' },
  { label: 'Pernambuco', value: 'PE' },
  { label: 'Piauí', value: 'PI' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Rio Grande do Norte', value: 'RN' },
  { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Rondônia', value: 'RO' },
  { label: 'Roraima', value: 'RR' },
  { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Sergipe', value: 'SE' },
  { label: 'Tocantins', value: 'TO' }
]

interface Props {
  formRef: React.RefObject<FormHandles>
  onClose: () => void
}

export const ConflictForm: React.FC<Props> = ({ onClose, formRef }) => {
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  const handleSaveSender = useCallback(
    async (data: Execution) => {
      try {
        loadStart()

        const schema = Yup.object().shape({
          uf: Yup.string().required('A unidade federativa é obrigatório')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        await api.post('/conflicts', data)
        addToast({
          type: 'info',
          title: 'Executando sincronização',
          description: 'Os clientes estão sendo checados no sefaz.'
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
          title: 'Erro na sincronização',
          description: String(err)
        })
      }
    },
    [addToast, formRef, onClose, loadStart, loadFinish]
  )

  return (
    <>
      <header>
        <h2>Iniciar consulta</h2>
      </header>
      <SimpleBar style={{ maxHeight: '50vh' }}>
        <Form ref={formRef} onSubmit={handleSaveSender}>
          <Select
            label="Unidade Federativa"
            name="uf"
            placeholder="Selecione a UF"
            options={ufs}
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
          <BiPlay size={24} />
          <span>Iniciar</span>
        </Button>
      </footer>
    </>
  )
}
