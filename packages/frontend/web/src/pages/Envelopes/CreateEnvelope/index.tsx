import { FormHandles } from '@unform/core'
import React, { useCallback, useRef } from 'react'
import { BiArrowBack, BiRightArrowAlt } from 'react-icons/bi'
import { RouteComponentProps } from 'react-router-dom'
import * as Yup from 'yup'

import Button from '../../../components/Button'
import { Form, Input, ButtonsRight } from '../../../components/Form'
import Header from '../../../components/Header'
import { useLoading } from '../../../providers/loading'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import getValidationErrors from '../../../utils/getValidationErrors'
import { Container } from './styles'

interface IEnvelope {
  subject: string
  message: string
  user_id: string
}

const CreateEnvelope: React.FC<RouteComponentProps> = ({ history }) => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  const handleSubmit = useCallback(
    async (data: IEnvelope) => {
      try {
        loadStart()

        const schema = Yup.object().shape({
          subject: Yup.string().required('O nome é obrigatório')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        const response = await api.post('/envelopes', data)

        addToast({
          type: 'success',
          title: 'Envelope criado',
          description: 'Adicione os documentos do envelope'
        })
        loadFinish()
        history.push(`/envelopes/${response.data.id}/documents`)
      } catch (err) {
        loadFinish()
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
          return
        }
        addToast({
          type: 'error',
          title: 'Erro na criação do envelope',
          description: err
        })
      }
    },
    [addToast, formRef, history, loadStart, loadFinish]
  )

  return (
    <Container>
      <Header>
        <h1>Novo envelope</h1>
        <div>
          <Button onClick={() => history.goBack()} color="primary">
            <BiArrowBack size={24} />
            <span className="hide-lg-down">Cancelar</span>
          </Button>
        </div>
      </Header>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Input name="subject" label="Nome" />
        <Input name="message" label="Mensagem" multiline />
        <ButtonsRight>
          <Button loading={isLoading} type="submit">
            <BiRightArrowAlt size={24} />
            <span>Próximo</span>
          </Button>
        </ButtonsRight>
      </Form>
    </Container>
  )
}

export default CreateEnvelope
