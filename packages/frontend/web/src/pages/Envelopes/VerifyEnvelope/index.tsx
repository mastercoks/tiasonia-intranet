/* eslint-disable no-throw-literal */
import { FormHandles } from '@unform/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BiDownload, BiSearch } from 'react-icons/bi'
import { RouteComponentProps } from 'react-router-dom'
import * as Yup from 'yup'

import logo from '../../../assets/logo.svg'
import Button from '../../../components/Button'
import { Form, Input } from '../../../components/Form'
import { Container, LogoContent } from '../../../pages/SignIn/styles'
import { useLoading } from '../../../providers/loading'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import getValidationErrors from '../../../utils/getValidationErrors'
import { Content } from './styles'

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

interface RouteParams {
  id: string
}

const VerifyEnvelope: React.FC<RouteComponentProps<RouteParams>> = ({
  match
}) => {
  const { id } = match.params
  const formRef = useRef<FormHandles>(null)
  const [envelope, setEnvelope] = useState<IEnvelope>()
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  const handleDownloadOriginal = useCallback(async () => {
    if (!envelope?.original) {
      addToast({
        type: 'info',
        title: 'Download não disponível',
        description: 'Favor entrar em contato com o administrador.'
      })
      return
    }
    try {
      const { data } = await api.get(envelope?.original, {
        responseType: 'blob'
      })
      const downloadUrl = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', `${envelope.subject}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro no donwload',
        description: err
      })
    }
  }, [addToast, envelope])

  const handleDownloadManifest = useCallback(async () => {
    if (!envelope?.manifest) {
      addToast({
        type: 'info',
        title: 'Download não disponível',
        description: 'Favor entrar em contato com o administrador.'
      })
      return
    }
    try {
      const { data } = await api.get(envelope?.manifest, {
        responseType: 'blob'
      })
      const downloadUrl = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = downloadUrl

      link.setAttribute('download', `${envelope.subject}[manifesto].pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro no donwload',
        description: err
      })
    }
  }, [addToast, envelope])

  useEffect(() => {
    async function loadData() {
      try {
        loadStart()
        const { data } = await api.get<IEnvelope>(`/envelopes/${id}`)
        if (data.status !== 'concluído') throw 'Envelope não está concluído.'
        setEnvelope(data)
        loadFinish()
      } catch (err) {
        loadFinish()
        addToast({
          type: 'error',
          title: 'Erro na validação',
          description: err
        })
      }
    }
    if (id) {
      loadData()
    }
  }, [addToast, id, loadStart, loadFinish])

  const handleConfirm = useCallback(
    async data => {
      try {
        loadStart()
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          code: Yup.string()
            .uuid('Código inválido')
            .required('Código é obrigatório')
        })
        await schema.validate(data, {
          abortEarly: false
        })

        const { data: response } = await api.get<IEnvelope>(
          `/envelopes/${data?.code}`
        )
        if (response.status !== 'concluído')
          throw 'Envelope não está concluído.'
        setEnvelope(response)
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
          title: 'Erro na validação',
          description: err
        })
      }
    },
    [addToast, loadStart, loadFinish]
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
      <Content>
        {envelope ? (
          <>
            <h2>Documento válido!</h2>
            <p>
              Este documento foi assinado corretamente através do portal de
              assinaturas da Teiú.
            </p>
            <Button size="big" onClick={handleDownloadOriginal}>
              <BiDownload size={24} />
              <span>Baixar Original</span>
            </Button>
            <Button size="big" onClick={handleDownloadManifest}>
              <BiDownload size={24} />
              <span>Baixar Manifesto</span>
            </Button>
          </>
        ) : (
          <Form ref={formRef} onSubmit={handleConfirm}>
            <h2>{id ? 'Documento inválido!' : 'Verificador de assinaturas'}</h2>
            <p>
              {id
                ? 'Verifique se você digitou corretamente o código, ou se o documento já possui assinaturas e tente novamente.'
                : 'Verifique aqui se um documento digital está corretamente assinado dentro do Portal de Assinaturas da Teiú e quais pessoas assinaram.'}
            </p>
            <Input
              label="Código"
              name="code"
              placeholder="Digite o código de verificação"
              defaultValue={id || ''}
            />
            <Button size="big" type="submit" loading={isLoading}>
              <BiSearch size={24} />
              <span>Buscar</span>
            </Button>
          </Form>
        )}
      </Content>
    </Container>
  )
}

export default VerifyEnvelope
