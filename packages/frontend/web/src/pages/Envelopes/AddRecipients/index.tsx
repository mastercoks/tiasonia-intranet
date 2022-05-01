import { FormHandles } from '@unform/core'
import { useCallback, useRef, useState } from 'react'
import { BiArrowBack, BiMailSend, BiUserPlus, BiX } from 'react-icons/bi'
import { FaPaperPlane, FaUser, FaCheck } from 'react-icons/fa'
import { RouteComponentProps } from 'react-router-dom'
import * as Yup from 'yup'

import Button from '../../../components/Button'
import {
  AsyncSelect,
  ButtonsRight,
  Form,
  Select
} from '../../../components/Form'
import Header from '../../../components/Header'
import Steps from '../../../components/Steps'
import { useAuth } from '../../../providers/auth'
import { useLoading } from '../../../providers/loading'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import capitalize from '../../../utils/capitalize'
import getValidationErrors from '../../../utils/getValidationErrors'
import { Container, Recipient } from './styles'

const actions = [
  { value: 'autorizar', label: 'Autorizar' },
  { value: 'ter ciência', label: 'Ciência' },
  { value: 'dar um parecer', label: 'Parecer' },
  { value: 'visualizar', label: 'Visualizar' }
]

interface IRecipients {
  id: string
  name: string
  email: string
}

interface RouteParams {
  id: string
}

const AddRecipients: React.FC<RouteComponentProps<RouteParams>> = ({
  history,
  match
}) => {
  const [orders, setOrders] = useState<number[]>([])
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const { user } = useAuth()
  const { isLoading, loadStart, loadFinish } = useLoading()

  const { id } = match.params

  const handleAddRecipient = useCallback(() => {
    setOrders(orders => {
      const order = orders[orders.length - 1] + 1
      return [...orders, !isNaN(order) ? order : 0]
    })
  }, [])

  const handleRemoveRecipient = useCallback(
    index => {
      const newOrders = [...orders]
      newOrders.splice(newOrders.indexOf(index), 1)
      setOrders(newOrders)
    },
    [orders]
  )

  const handleSubmit = useCallback(
    async data => {
      if (!data?.recipients && !data?.actions) {
        addToast({
          type: 'error',
          title: 'Erro no envio do envelope',
          description: 'Destinatário não pode ficar vazio.'
        })
        return
      }

      try {
        loadStart()
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          recipients: Yup.array().of(
            Yup.string().required('O destinatário é obrigatório')
          ),
          actions: Yup.array().of(Yup.string().required('A ação é obrigatória'))
        })

        await schema.validate(data, {
          abortEarly: false
        })
        const recipients = []
        for (let index = 0; index < data.recipients.length; index++) {
          recipients.push({
            order: index + 1,
            contact: data.recipients[index],
            action: data.actions[index]
          })
        }

        await api.post(`/envelopes/${id}/recipients`, {
          recipients
        })

        addToast({
          type: 'success',
          title: 'Envelope enviado',
          description: 'Foi iniciado o fluxo do envelope'
        })
        loadFinish()

        history.push(`/envelopes`)
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
    [addToast, formRef, id, history, loadStart, loadFinish]
  )

  const loadContacts = useCallback(async search => {
    const response = await api.get<IRecipients[]>('/contacts', {
      params: { name: search }
    })

    return response.data.map(contact => ({
      value: contact.id,
      label: `${capitalize(contact.name)} - ${contact.email}`
    }))
  }, [])

  return (
    <Container>
      <Header>
        <h1>Adicionar Destinatários</h1>
        <div>
          <Button
            onClick={() => {
              history.goBack()
            }}
            color="primary"
          >
            <BiArrowBack size={24} />
            <span className="hide-lg-down">Voltar</span>
          </Button>
        </div>
      </Header>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Steps
          steps={[
            {
              icon: FaPaperPlane,
              label: 'Remetente',
              content: (
                <div>
                  <span>
                    <b>{capitalize(user?.contact?.name)}</b>
                  </span>
                  <h5>{user?.contact?.email}</h5>
                </div>
              )
            },
            {
              icon: FaUser,
              label: 'Destinatários',
              content: (
                <div>
                  {orders.map(order => (
                    <Recipient key={order}>
                      <AsyncSelect
                        label="Destinatário"
                        name={`recipients[${order}]`}
                        placeholder="Selecione o tipo"
                        defaultOptions
                        loadOptions={loadContacts}
                      />
                      <Select
                        label="Ação"
                        name={`actions[${order}]`}
                        placeholder="Selecione o tipo"
                        options={actions}
                      />
                      <Button
                        size="small"
                        color="danger-outline"
                        onClick={() => handleRemoveRecipient(order)}
                      >
                        <BiX size={24} />
                      </Button>
                    </Recipient>
                  ))}
                  <Button
                    onClick={handleAddRecipient}
                    color="dark-outline"
                    type="button"
                  >
                    <BiUserPlus size={20} />
                    <span>Adicionar Destinatário</span>
                  </Button>
                </div>
              )
            },
            {
              icon: FaCheck,
              content: (
                <span>
                  Depois de um envelope ter sido enviado para todos os
                  destinatários e os documentos assinados, o remetente irá
                  receber um manifesto das assinaturas.
                </span>
              )
            }
          ]}
        />
        <ButtonsRight>
          <Button loading={isLoading} type="submit">
            <BiMailSend size={24} />
            <span>Enviar </span>
          </Button>
        </ButtonsRight>
      </Form>
    </Container>
  )
}

export default AddRecipients
