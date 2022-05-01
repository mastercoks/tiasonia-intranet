import { FormHandles } from '@unform/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BiEnvelope, BiLockAlt } from 'react-icons/bi'
import { RouteComponentProps } from 'react-router-dom'
import * as Yup from 'yup'

import logo from '../../../assets/logo.svg'
import Button from '../../../components/Button'
import { Input } from '../../../components/Form'
import {
  Container,
  FormContent,
  LogoContent
} from '../../../pages/SignIn/styles'
import { useLoading } from '../../../providers/loading'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import getValidationErrors from '../../../utils/getValidationErrors'
import Documents from '../Documents'
import { Content } from './styles'

interface RouteParams {
  recipient_id: string
}

interface AuthFormData {
  email: string
  password: string
}

interface IContact {
  id: string
  name: string
  email: string
  confirm: boolean
}

interface IDocument {
  id: string
  name: string
  url: string
  size: string
  created_at: Date
}

interface IEnvelope {
  id: string
  subject: string
  message: string
  status: string
  sender: IContact
  original: string
  manifest: string
  documents: IDocument[]
  recipients: IRecipient[]
}

interface IRecipient {
  id: string
  action: string
  status: string
  order: number
  tag: string
  message: string
  contact: IContact
  envelope_id: string
}

const Sign: React.FC<RouteComponentProps<RouteParams>> = ({ match }) => {
  const { recipient_id } = match.params
  const [recipient, setRecipient] = useState<IRecipient>()
  const [envelope, setEnvelope] = useState<IEnvelope>()
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  useEffect(() => {
    async function loadData() {
      try {
        loadStart()
        const { data } = await api.get<IRecipient>(
          `/recipients/${recipient_id}`
        )
        setRecipient(data)
        loadFinish()
      } catch (err) {
        loadFinish()
        setMessage(err)
      }
    }
    if (recipient_id) {
      loadData()
    }
  }, [recipient_id, loadStart, loadFinish])

  const handleConfirm = useCallback(
    async (data: AuthFormData) => {
      try {
        loadStart()
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          email: Yup.string().required('E-mail é obrigatório'),
          password: Yup.string()
            .test(
              'min-password',
              'A senha precisa ter pelo menos 6 caracteres',
              value => value == null || value.length === 0 || value.length >= 6
            )
            .required('A senha obrigatória')
        })
        await schema.validate(data, {
          abortEarly: false
        })

        const {
          data: { token }
        } = await api.post(`/recipients/${recipient_id}`, data)

        const { data: envelope } = await api.get(
          `/envelopes/${recipient?.envelope_id}`,
          {
            headers: { token }
          }
        )
        setToken(token)
        setEnvelope(envelope)
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
          title: 'Erro na autenticação',
          description: err
        })
      }
    },
    [addToast, recipient_id, recipient, loadStart, loadFinish]
  )

  if (recipient && envelope && token) {
    return (
      <Documents
        recipient={recipient}
        envelope={envelope}
        token={token}
        id={recipient_id}
      />
    )
  }

  return (
    <Container>
      <LogoContent>
        <div>
          <img src={logo} alt="Teiú Intranet" />
          <h1>Intranet</h1>
        </div>
        <h2>Assinatura Eletrônica</h2>
      </LogoContent>
      {message ? (
        <Content>
          <h2>{message}</h2>
        </Content>
      ) : (
        <FormContent ref={formRef} onSubmit={handleConfirm}>
          <h2>Entre com seus dados</h2>
          <Input
            label="E-mail"
            name="email"
            icon={BiEnvelope}
            placeholder="Digite seu e-mail"
            autoComplete="username"
            value={recipient?.contact?.email || ''}
            disabled
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            icon={BiLockAlt}
            placeholder="Digite sua senha"
            autoComplete="current-password"
            aria-describedby="password-constraints"
          />
          <Button
            size="big"
            color="secondary"
            type="submit"
            loading={isLoading}
          >
            Entrar
          </Button>
        </FormContent>
      )}
    </Container>
  )
}

export default Sign
