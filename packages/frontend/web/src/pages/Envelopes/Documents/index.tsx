import { FormHandles } from '@unform/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  BiBulb,
  BiCheck,
  BiCommentDetail,
  BiInfoCircle,
  BiNavigation,
  BiPencil,
  BiTime,
  BiX
} from 'react-icons/bi'

import Button from '../../../components/Button'
import Card from '../../../components/Card'
import { Form, Select } from '../../../components/Form'
import Checkbox from '../../../components/Form/Checkbox'
import Header from '../../../components/Header'
import Modal from '../../../components/Modal'
import PDFView from '../../../components/PDFView'
import Steps from '../../../components/Steps'
import Tooltip from '../../../components/Tooltip'
import { useLoading } from '../../../providers/loading'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import capitalize from '../../../utils/capitalize'
import { REACT_APP_API_URL } from '../../../utils/environment'
import getTypeColor from '../../../utils/getTypeColor'
import MessageForm from '../MessageForm'
import {
  Container,
  Main,
  ASidebar,
  Card as CardContainer,
  Status,
  Row,
  ClickArea,
  MessageContainer,
  HidePDFView
} from './styles'
import 'simplebar/dist/simplebar.min.css'

const actions = [
  { value: 'autorizar', label: 'Autorizar' },
  { value: 'ter ciência', label: 'Ciência' },
  { value: 'dar um parecer', label: 'Parecer' }
]

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

interface Props {
  recipient: IRecipient
  envelope: IEnvelope
  token: string
  id: string
}

const Documents: React.FC<Props> = ({ recipient, envelope, token, id }) => {
  const [showPdf, setShowPdf] = useState(
    !(recipient.action === 'ter ciência' && recipient.status === 'pendente')
  )
  const [hideNextStep, setHideNextStep] = useState(false)
  const [requiredMessage, setRequiredMessage] = useState(true)
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const [nextStep, setNextStep] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  const handleSubmit = useCallback(
    async data => {
      loadStart()
      try {
        await api.post(
          `/envelopes/${envelope.id}/recipients/${recipient.id}`,
          {
            status: status || data.status,
            message: data.message
          },
          {
            headers: { token }
          }
        )
        addToast({
          type: 'success',
          title: 'Enviado com sucesso',
          description: `O envelope foi ${data?.status} com sucesso.`
        })
        if (!showPdf) setShowPdf(true)
        setNextStep(false)
        setHideNextStep(true)
        loadFinish()
      } catch (err) {
        loadFinish()
        addToast({
          type: 'error',
          title: 'Erro no envio',
          description: err
        })
      }
    },
    [
      addToast,
      envelope,
      recipient,
      status,
      token,
      loadStart,
      loadFinish,
      showPdf
    ]
  )

  const handleCloseModal = useCallback(() => {
    setStatus('')
  }, [])

  const handleCloseModalMessage = useCallback(() => {
    setMessage('')
  }, [])

  const handleOpenModalMessage = useCallback(message => {
    setMessage(message)
  }, [])

  const handleCompleted = useCallback(() => {
    handleSubmit({ status: 'concluído' })
  }, [handleSubmit])

  const handleModalApproved = useCallback(() => {
    setRequiredMessage(false)
    setStatus('concluído')
  }, [])

  const handleModalAdvice = useCallback(() => {
    setRequiredMessage(true)
    setStatus('concluído')
  }, [])

  const handleModalDeclined = useCallback(() => {
    setRequiredMessage(true)
    setStatus('recusado')
  }, [])

  const showNextStep = useCallback(() => setNextStep(true), [])
  const handleHideNextStep = useCallback(() => setNextStep(false), [])
  const handleAgreed = useCallback(() => setAgreed(agreed => !agreed), [])

  useEffect(() => {
    function loadData() {
      formRef.current?.setData({
        action: recipient?.action
      })
    }

    if (nextStep) {
      loadData()
    }
  }, [nextStep, recipient?.action])

  return (
    <Container>
      <Main>
        <Header>
          <h1>
            {envelope?.subject}{' '}
            <span style={{ color: getTypeColor(envelope?.status) }}>
              {' '}
              - Envelope {envelope?.status}
            </span>
          </h1>
        </Header>
        {showPdf ? (
          <PDFView src={REACT_APP_API_URL + envelope?.original} />
        ) : (
          <HidePDFView>
            <Card>
              <h2>Envelope ocultado</h2>
              <h3>Siga os passos para poder visualizar o envelope</h3>
              <Steps
                steps={[
                  {
                    icon: '1',
                    content: <h4>Clique no botão &quot;Próxima etapa&quot;.</h4>
                  },
                  {
                    icon: '2',
                    content: (
                      <h4>
                        Marque a opção &quot;Concordo em usar assinaturas e
                        registros eletrônicos&quot;.
                      </h4>
                    )
                  },
                  {
                    icon: '3',
                    content: (
                      <h4>
                        Por fim, clique no botão &quot;Estou ciente&quot;.
                      </h4>
                    )
                  }
                ]}
              />
            </Card>
          </HidePDFView>
        )}
      </Main>
      <ASidebar>
        {nextStep ? (
          <>
            <header>
              <BiNavigation size={24} />
              <h1>Ação do documento</h1>
            </header>
            {envelope?.recipients
              .filter(
                recipient =>
                  recipient.action === 'dar um parecer' && recipient.message
              )
              .map((recipient, key) => (
                <ClickArea
                  key={key}
                  onClick={() => handleOpenModalMessage(recipient.message)}
                >
                  <CardContainer>
                    <Row>
                      <div>
                        <h4>{capitalize(recipient?.contact?.name)}</h4>
                        <span>Ver parecer</span>
                      </div>
                      <BiCommentDetail size={20} />
                    </Row>
                  </CardContainer>
                </ClickArea>
              ))}
            <Form ref={formRef} onSubmit={() => null}>
              <Select
                label="Tipo de assinatura"
                name="action"
                placeholder="Selecione o tipo"
                options={actions}
                isDisabled
              />
              <Checkbox
                name="confirm"
                options={[
                  {
                    id: 'confirm',
                    label:
                      'Concordo em usar assinaturas e registros eletrônicos.'
                  }
                ]}
                onClick={handleAgreed}
              />
              {recipient.action === 'ter ciência' && (
                <Button
                  size="big"
                  color="success"
                  disabled={!agreed}
                  onClick={handleCompleted}
                  loading={isLoading}
                >
                  Estou ciente
                </Button>
              )}
              {recipient.action === 'autorizar' && (
                <>
                  <Button
                    size="big"
                    color="success"
                    disabled={!agreed}
                    onClick={handleModalApproved}
                    loading={isLoading}
                  >
                    Aprovar
                  </Button>
                  <Button
                    size="big"
                    color="danger"
                    onClick={handleModalDeclined}
                    loading={isLoading}
                  >
                    Rejeitar
                  </Button>
                </>
              )}
              {recipient.action === 'dar um parecer' && (
                <>
                  <Button
                    size="big"
                    disabled={!agreed}
                    onClick={handleModalAdvice}
                    loading={isLoading}
                  >
                    Escrever parecer
                  </Button>
                </>
              )}
              <Button
                size="big"
                color="medium-outline"
                type="reset"
                onClick={handleHideNextStep}
                loading={isLoading}
              >
                Cancelar
              </Button>
            </Form>
          </>
        ) : (
          <>
            <header>
              <BiInfoCircle size={24} />
              <h1>Informações</h1>
            </header>
            {!hideNextStep &&
              envelope.status === 'pendente' &&
              recipient.status === 'pendente' && (
                <Button size="big" onClick={showNextStep}>
                  Próxima etapa
                </Button>
              )}
            <h3>Documentos</h3>
            {envelope?.documents.map((document, key) => (
              <CardContainer key={key}>
                <Status status={envelope.status} />
                <h4>{document.name}</h4>
                <span>
                  Publicado em: {new Date(document.created_at).toLocaleString()}
                </span>
              </CardContainer>
            ))}
            <h3>Autor</h3>
            <CardContainer>
              <Status status="autor" />
              <h4>{capitalize(envelope?.sender?.name)}</h4>
              <span>{envelope?.sender?.email}</span>
            </CardContainer>
            <h3>Destinatários</h3>
            {envelope?.recipients.map((recipient, key) => (
              <CardContainer
                key={key}
                className={recipient.id === id ? 'active' : ''}
              >
                <Status status={recipient.status} />
                <Row>
                  <div>
                    <h4>{capitalize(recipient?.contact?.name)}</h4>
                    <span>{recipient?.contact?.email}</span>
                  </div>
                  <Tooltip title={capitalize(recipient.status)}>
                    {recipient.status === 'esperando' ? (
                      <BiTime size={20} />
                    ) : recipient.status === 'concluído' ? (
                      <BiCheck size={20} />
                    ) : recipient.status === 'recusado' ? (
                      <BiX size={20} />
                    ) : recipient.action === 'autorizar' ? (
                      <BiPencil size={20} />
                    ) : recipient.action === 'dar um parecer' ? (
                      <BiCommentDetail size={20} />
                    ) : (
                      <BiBulb size={20} />
                    )}
                  </Tooltip>
                </Row>
              </CardContainer>
            ))}
          </>
        )}
      </ASidebar>
      {!!status && (
        <Modal open={!!status} onClose={handleCloseModal} size="md">
          <MessageForm
            onSubmit={handleSubmit}
            onClose={handleCloseModal}
            required={requiredMessage}
          />
        </Modal>
      )}
      {!!message && (
        <Modal open={!!message} onClose={handleCloseModalMessage} size="md">
          <Card>
            <header>
              <h2>Parecer</h2>
              <Button
                size="small"
                color="medium-outline"
                onClick={handleCloseModalMessage}
                style={{ padding: '4px', border: 'none' }}
                loading={isLoading}
              >
                <BiX size={24} />
              </Button>
            </header>
            <MessageContainer>
              <span>{message}</span>
            </MessageContainer>
            <footer />
          </Card>
        </Modal>
      )}
    </Container>
  )
}

export default Documents
