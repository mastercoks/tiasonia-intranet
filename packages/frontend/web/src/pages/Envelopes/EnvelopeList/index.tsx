import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef, useState } from 'react'
import {
  BiBlock,
  BiEditAlt,
  BiFilterAlt,
  BiFolderOpen,
  BiPlus
} from 'react-icons/bi'
import { RouteComponentProps } from 'react-router-dom'

import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Filters, { FilterHandles } from '../../../components/Filters'
import { Input, Select } from '../../../components/Form'
import Header from '../../../components/Header'
import PaginatedTable from '../../../components/PaginatedTable'
import Tooltip from '../../../components/Tooltip'
import { useLoading } from '../../../providers/loading'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import usePaginatedRequest from '../../../services/usePaginatedRequest'
import theme from '../../../styles/theme'
import capitalize from '../../../utils/capitalize'
import { diffDays } from '../../../utils/formatters'
import getTypeColor from '../../../utils/getTypeColor'
import { Buttons, Container, ScrollArea } from './styles'

interface Document {
  id: string
  name: string
  size: string
  url: string
}

interface Contact {
  id: string
  name: string
  email: string
  confirm: boolean
}

interface Recipient {
  id: string
  order: number
  action: string
  status: string
  tag: string
  contact: Contact
}

interface Envelope {
  id: string
  status: string
  documents: Array<Document>
  recipients: Array<Recipient>
  subject: string
  message: string
  updated_at: Date
}

const EnvelopeList: React.FC<RouteComponentProps> = ({ history }) => {
  const filterRef = useRef<FilterHandles>(null)
  const formFilterRef = useRef<FormHandles>(null)
  const [filters, setFilters] = useState(null)
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  const request = usePaginatedRequest<Array<Envelope>>({
    url: `/envelopes`,
    params: filters
  })

  const handleOpenFilter = useCallback(() => {
    request.resetPage()
    filterRef.current?.toggleModal(true)
  }, [request])

  const handleResetForm = useCallback(() => {
    formFilterRef.current?.reset()
  }, [])

  const handleClosed = useCallback(
    async ({ id, status }: Envelope) => {
      if (status !== 'pendente') {
        addToast({
          type: 'info',
          title: 'Envelope não foi encerrado',
          description: 'O envelope precisa estar pendente para ser encerrado'
        })
      } else {
        try {
          loadStart()
          await api.get(`/envelopes/${id}/closed`)
          addToast({
            type: 'success',
            title: 'Envelope encerrado',
            description: `O envelope foi encerrado com sucesso.`
          })
          request.revalidate()
          loadFinish()
        } catch (err) {
          loadFinish()
          addToast({
            type: 'error',
            title: 'Erro ao encerrar envelope',
            description: err
          })
        }
      }
    },
    [addToast, request, loadStart, loadFinish]
  )

  const handleSaveSender = useCallback(data => {
    filterRef.current?.toggleModal(false)
    !data.subject && delete data.subject
    !data.status && delete data.status
    setFilters(data)
  }, [])

  return (
    <Container>
      <Header>
        <h1>Envelopes</h1>
        <div>
          <Button onClick={handleOpenFilter} color="medium-outline">
            <BiFilterAlt size={24} />
            <span className="hide-lg-down">Filtrar</span>
          </Button>
          <Button onClick={() => history.push('/envelopes/create')}>
            <BiPlus size={24} />
            <span className="hide-lg-down">Novo</span>
          </Button>
        </div>
      </Header>
      <Box>
        <PaginatedTable request={request}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Status</th>
              <th>Destinatários</th>
              <th>Documentos</th>
              <th>Última movimentação</th>
              <th style={{ width: 32 }} />
              <th style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {request.data?.map(
              ({
                id,
                status,
                subject,
                updated_at,
                documents,
                recipients,
                ...rest
              }) => {
                recipients = recipients.sort((a, b) => {
                  if (a.order > b.order) return 1
                  if (a.order < b.order) return -1
                  return 0
                })
                return (
                  <tr key={id}>
                    <td>{capitalize(subject)}</td>
                    <td
                      style={{
                        color: theme.colors.light,
                        backgroundColor: getTypeColor(status)
                      }}
                    >
                      {capitalize(status)}
                    </td>
                    <td
                      style={{
                        background: theme.colors.light,
                        borderRadius: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {recipients.map(recipient => (
                        <Tooltip
                          title={recipient?.contact?.email}
                          key={recipient?.id}
                        >
                          <div
                            style={{
                              color: theme.colors.light,
                              backgroundColor: getTypeColor(recipient?.status),
                              width: 36,
                              height: 36,
                              fontWeight: 'bold',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 4,
                              textTransform: 'uppercase',
                              margin: '0 4px'
                            }}
                          >
                            {recipient?.contact?.name.substr(0, 2)}
                          </div>
                        </Tooltip>
                      ))}
                    </td>
                    <td>{documents.length}</td>
                    <td>{diffDays(new Date(updated_at))}</td>
                    <td className="button">
                      {status === 'rascunho' ? (
                        <Button
                          color="primary-outline"
                          size="small"
                          onClick={() =>
                            history.push(`/envelopes/${id}/documents`)
                          }
                        >
                          <BiEditAlt size={20} />
                          <span className="hide-lg-down">Editar</span>
                        </Button>
                      ) : (
                        <Button
                          color="primary-outline"
                          size="small"
                          onClick={() => history.push(`/envelopes/${id}`)}
                          style={{ width: '100%' }}
                        >
                          <BiFolderOpen size={20} />
                          <span className="hide-lg-down">Abrir</span>
                        </Button>
                      )}
                    </td>
                    <td className="button">
                      <Button
                        color="primary-outline"
                        size="small"
                        disabled={status !== 'pendente'}
                        loading={isLoading}
                        onClick={() =>
                          handleClosed({
                            id,
                            status,
                            subject,
                            updated_at,
                            documents,
                            recipients,
                            ...rest
                          })
                        }
                      >
                        <BiBlock size={20} />
                        <span className="hide-lg-down">Encerrar</span>
                      </Button>
                    </td>
                  </tr>
                )
              }
            )}
          </tbody>
        </PaginatedTable>
      </Box>
      <Filters ref={filterRef} title="Filtros">
        <Form ref={formFilterRef} onSubmit={handleSaveSender}>
          <ScrollArea>
            <Input label="Nome" name="subject" />
            <Select
              label="Status"
              name="status"
              placeholder="Selecione o status"
              options={[
                { value: 'rascunho', label: 'Rascunho' },
                { value: 'pendente', label: 'Pendente' },
                { value: 'concluído', label: 'Concluído' },
                { value: 'recusado', label: 'Recusado' },
                { value: 'encerrado', label: 'Encerrado' }
              ]}
              isSearchable={false}
            />
          </ScrollArea>
          <Buttons>
            <Button size="big" type="submit" color="secondary">
              Aplicar Filtro
            </Button>

            <Button size="big" color="primary" onClick={handleResetForm}>
              Limpar Filtro
            </Button>
          </Buttons>
        </Form>
      </Filters>
    </Container>
  )
}

export default EnvelopeList
