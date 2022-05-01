import { FormHandles } from '@unform/core'
import React, { useCallback, useRef } from 'react'
import { BiUser, BiLockAlt } from 'react-icons/bi'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'

import logo from '../../assets/logo.svg'
import Button from '../../components/Button'
import { Input } from '../../components/Form'
import { useAuth } from '../../providers/auth'
import { useLoading } from '../../providers/loading'
import { useToast } from '../../providers/toast'
import getValidationErrors from '../../utils/getValidationErrors'
import isValidCPF from '../../utils/isValidCPF'
import { Container, LogoContent, FormContent } from './styles'

interface SignInFormData {
  login: string
  password: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { signIn } = useAuth()
  const { addToast } = useToast()
  const history = useHistory()
  const { isLoading, loadStart, loadFinish } = useLoading()

  const handleSingIn = useCallback(
    async (data: SignInFormData) => {
      loadStart()
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          login: Yup.string()
            .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Digite apenas números')
            .test('is-jimmy', 'CPF precisa ser válido', isValidCPF)
            .required('CPF obrigatório'),
          password: Yup.string().required('Senha obrigatória')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        await signIn({
          login: data.login.replace(/[^\d]+/g, ''),
          password: data.password
        })
        loadFinish()
        history.push('/')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
          loadFinish()
          return
        }
        loadFinish()
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: err
        })
      }
    },
    [history, signIn, addToast, loadStart, loadFinish]
  )

  return (
    <Container>
      <LogoContent>
        <div>
          <img src={logo} alt="Teiú Intranet" />
          <h1>Intranet</h1>
        </div>
        <h2>Faça seu login na plataforma</h2>
      </LogoContent>
      <FormContent ref={formRef} onSubmit={handleSingIn}>
        <h2>Entre com seus dados</h2>
        <Input
          mask="999.999.999-99"
          label="CPF"
          name="login"
          icon={BiUser}
          placeholder="Digite seu cpf"
          autoComplete="username"
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
        <Button size="big" color="secondary" type="submit" loading={isLoading}>
          Entrar
        </Button>
      </FormContent>
    </Container>
  )
}

export default SignIn
