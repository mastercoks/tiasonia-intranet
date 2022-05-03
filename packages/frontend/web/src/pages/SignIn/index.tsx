import { FormHandles } from '@unform/core'
import React, { useCallback, useRef } from 'react'
import { BiUser, BiLockAlt } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import logo from '../../assets/logo.png'
import { Button, Input } from '../../components'
import { useAuth, useLoading, useToast } from '../../providers'
import { getValidationErrors } from '../../utils'
import { Container, LogoContent, FormContent } from './styles'

interface SignInFormData {
  login: string
  password: string
}

export const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { signIn } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { isLoading, loadStart, loadFinish } = useLoading()

  const handleSingIn = useCallback(
    async (data: SignInFormData) => {
      loadStart()
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          login: Yup.string().required('Login obrigatório'),
          password: Yup.string().required('Senha obrigatória')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        await signIn({
          login: data.login,
          password: data.password
        })
        loadFinish()
        navigate('/')
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
          description: String(err)
        })
      }
    },
    [loadStart, signIn, loadFinish, navigate, addToast]
  )

  return (
    <Container>
      <LogoContent>
        <div>
          <img src={logo} alt="Tia Sônia Intranet" />
          <h1>Tia Sônia - Intranet</h1>
        </div>
        <h2>Faça seu login na plataforma</h2>
      </LogoContent>
      <FormContent ref={formRef} onSubmit={handleSingIn}>
        <h2>Entre com seus dados</h2>
        <Input
          label="Login"
          name="login"
          icon={BiUser}
          placeholder="Digite seu login"
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
