import { useCallback, useEffect, useRef, useState } from 'react'
import {
  BiArrowBack,
  BiBulb,
  BiCheck,
  BiCommentDetail,
  BiDotsVerticalRounded,
  BiDownload,
  BiInfoCircle,
  BiPencil,
  BiTime,
  BiX
} from 'react-icons/bi'
import { RouteComponentProps } from 'react-router-dom'

import Button from '../../../components/Button'
import Card from '../../../components/Card'
import Dropdown, { DropdownHandles } from '../../../components/Dropdown'
import Header from '../../../components/Header'
import Modal from '../../../components/Modal'
import PDFView from '../../../components/PDFView'
import Tooltip from '../../../components/Tooltip'
import { useLoading } from '../../../providers/loading'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import capitalize from '../../../utils/capitalize'
import { REACT_APP_API_URL } from '../../../utils/environment'
import getTypeColor from '../../../utils/getTypeColor'
import {
  Card as CardContainer,
  Status,
  Row,
  ClickArea,
  MessageContainer
} from '../Documents/styles'
import { Container, Main, ASidebar } from './styles'

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

const ShowEnvelope: React.FC<RouteComponentProps<RouteParams>> = ({
  match,
  history
}) => {
  const { id } = match.params
  const [envelope, setEnvelope] = useState<IEnvelope>()
  const [message, setMessage] = useState('')
  const dropdownRef = useRef<DropdownHandles>(null)
  const { addToast } = useToast()
  const { loadStart, loadFinish } = useLoading()

  const handleCloseModalMessage = useCallback(() => {
    setMessage('')
  }, [])

  const handleOpenModalMessage = useCallback(message => {
    setMessage(message)
  }, [])

  const handleDropdown = useCallback(() => {
    dropdownRef.current?.handleShowMenu()
  }, [])

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
        setEnvelope(data)
        loadFinish()
      } catch (err) {
        loadFinish()
        addToast({
          type: 'error',
          title: 'Erro nao envelope',
          description: err
        })
      }
    }
    if (id) {
      loadData()
    }
  }, [addToast, id, loadStart, loadFinish])

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
          <div>
            <Button onClick={() => history.goBack()} color="medium-outline">
              <BiArrowBack size={24} />
              <span className="hide-lg-down">Voltar</span>
            </Button>
            <Button onClick={handleDropdown} style={{ position: 'relative' }}>
              <BiDotsVerticalRounded size={24} />
              <span className="hide-lg-down">Opções</span>
              <Dropdown ref={dropdownRef} space={16}>
                <Button color="secondary" onClick={handleDownloadOriginal}>
                  <BiDownload size={24} />
                  <span>Original</span>
                </Button>
                {envelope?.manifest && (
                  <Button color="secondary" onClick={handleDownloadManifest}>
                    <BiDownload size={24} />
                    <span>Manifesto</span>
                  </Button>
                )}
              </Dropdown>
            </Button>
          </div>
        </Header>
        {envelope?.original && (
          <PDFView src={REACT_APP_API_URL + envelope?.original} />
        )}
      </Main>
      <ASidebar>
        <header>
          <BiInfoCircle size={24} />
          <h1>Informações</h1>
        </header>
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
          <ClickArea
            key={key}
            onClick={() => handleOpenModalMessage(recipient.message)}
          >
            <CardContainer>
              <Status status={recipient.status} />
              <Row>
                <div>
                  <h5>{capitalize(recipient.action)}</h5>
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
          </ClickArea>
        ))}
      </ASidebar>
      {!!message && (
        <Modal open={!!message} onClose={handleCloseModalMessage} size="md">
          <Card>
            <header>
              <h2>Mensagem</h2>
              <Button
                size="small"
                color="medium-outline"
                onClick={handleCloseModalMessage}
                style={{ padding: '4px', border: 'none' }}
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

export default ShowEnvelope
