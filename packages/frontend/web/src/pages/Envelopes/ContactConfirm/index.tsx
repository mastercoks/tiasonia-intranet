import { FormHandles } from '@unform/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BiLockAlt } from 'react-icons/bi'
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
import { Content } from './styles'

interface RouteParams {
  email: string
  password: string
}

interface ConfirmFormData {
  password: string
  confirm_password: string
}

const ContactConfirm: React.FC<RouteComponentProps<RouteParams>> = ({
  match
}) => {
  const { email, password } = match.params
  const [message, setMessage] = useState('')
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  useEffect(() => {
    async function loadData() {
      try {
        loadStart()
        await api.get(`/contacts/verify/${email}`)
        loadFinish()
      } catch (err) {
        loadFinish()
        setMessage(err)
      }
    }
    if (email) {
      loadData()
    }
  }, [email, loadStart, loadFinish])

  const handleConfirm = useCallback(
    async (data: ConfirmFormData) => {
      try {
        loadStart()
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          password: Yup.string()
            .test(
              'min-password',
              'A senha precisa ter pelo menos 6 caracteres',
              value => value == null || value.length === 0 || value.length >= 6
            )
            .required('A senha obrigatória'),
          confirm_password: Yup.string()
            .test(
              'min-password',
              'A senha precisa ter pelo menos 6 caracteres',
              value => value == null || value.length === 0 || value.length >= 6
            )
            .oneOf([Yup.ref('password'), undefined], 'Senhas não são iguais')
            .required('A confirmação da senha obrigatória')
        })
        await schema.validate(data, {
          abortEarly: false
        })

        await api.post('/contacts/confirm', {
          email,
          password,
          new_password: data.password
        })

        addToast({
          type: 'success',
          title: 'Conta ativada',
          description: 'Ocorreu um erro na confirmação.'
        })
        setMessage('Conta ativada com sucesso!')
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
    [addToast, email, password, loadStart, loadFinish]
  )
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
          <h2>Confirme a sua conta</h2>
          <Input
            label="Senha"
            name="password"
            type="password"
            icon={BiLockAlt}
            placeholder="Digite sua senha"
            autoComplete="new-password"
            aria-describedby="password-constraints"
          />
          <Input
            label="Confime a Senha"
            name="confirm_password"
            type="password"
            icon={BiLockAlt}
            placeholder="Repita sua senha"
            autoComplete="new-password"
            aria-describedby="password-constraints"
          />
          <Button
            size="big"
            color="secondary"
            type="submit"
            loading={isLoading}
          >
            Confirmar
          </Button>
        </FormContent>
      )}
    </Container>
  )
}

export default ContactConfirm
