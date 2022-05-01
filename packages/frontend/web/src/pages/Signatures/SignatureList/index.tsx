import { FormHandles } from '@unform/core'
import { useCallback, useRef, useState } from 'react'
import { BiEditAlt, BiFilterAlt, BiMailSend, BiPlus } from 'react-icons/bi'
import api from 'services/axios'
import { REACT_APP_API_URL } from 'utils/environment'

import Button from '../../../components/Button'
import Filters, { FilterHandles } from '../../../components/Filters'
import { Form, Input } from '../../../components/Form'
import Header from '../../../components/Header'
import Modal from '../../../components/Modal'
import PaginatedTable from '../../../components/PaginatedTable'
import { useToast } from '../../../providers/toast'
import usePaginatedRequest from '../../../services/usePaginatedRequest'
import capitalize from '../../../utils/capitalize'
import SignatureForm from '../SignatureForm'
import { Container, Buttons, ScrollArea } from './styles'

interface Company {
  id: string
  name: string
  logo: string
  site: string
  group: string
  disclaimer: string
}

interface Signature {
  id: string
  name: string
  link: string
  role: string
  telephone: string
  cellphone: string
  email: string
  active: boolean
  company: Company
}

const SignatureList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false)
  const [filters, setFilters] = useState(null)
  const [signatureId, setSignatureId] = useState(null)
  const formRef = useRef<FormHandles>(null)
  const filterRef = useRef<FilterHandles>(null)
  const formFilterRef = useRef<FormHandles>(null)
  const { addToast } = useToast()

  const request = usePaginatedRequest<Signature[]>({
    url: '/signatures',
    params: filters
  })

  const handleCloseModal = useCallback(() => {
    formRef.current?.setErrors({})
    formRef.current?.reset()
    setOpenModal(false)
    request.revalidate()
  }, [request])

  const handleOpenModal = useCallback((id = undefined) => {
    setSignatureId(id)
    setOpenModal(true)
  }, [])

  const handleSendMail = useCallback(
    (id: string) => {
      api.head(`/signatures/${id}`)
      addToast({
        type: 'info',
        title: 'Email enviado',
        description: 'A assinatura está sendo enviada para o email informado.'
      })
    },
    [addToast]
  )

  const handleOpenFilter = useCallback(() => {
    request.resetPage()
    filterRef.current?.toggleModal(true)
  }, [request])

  const handleResetForm = useCallback(() => {
    formFilterRef.current?.reset()
  }, [])

  const handleSaveSender = useCallback(data => {
    filterRef.current?.toggleModal(false)
    !data.name && delete data.name
    !data.email && delete data.email
    !data.role && delete data.role
    setFilters(data)
  }, [])

  return (
    <Container>
      <Header>
        <h1>Assinaturas</h1>
        <div>
          <Button onClick={handleOpenFilter} color="medium-outline">
            <BiFilterAlt size={24} />
            <span className="hide-lg-down">Filtrar</span>
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <BiPlus size={24} />
            <span className="hide-lg-down">Novo</span>
          </Button>
        </div>
      </Header>
      <PaginatedTable request={request}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Nome</th>
            <th>Cargo</th>
            <th>Telefone</th>
            <th>Celular</th>
            <th style={{ width: 32 }} />
            <th style={{ width: 32 }} />
          </tr>
        </thead>
        <tbody>
          {request.data?.map(signature => (
            <tr key={signature.id}>
              <td className={!signature.active ? 'inactive' : ''}>
                <a
                  href={REACT_APP_API_URL + signature.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {signature.email}
                </a>
              </td>
              <td>{capitalize(signature.name)}</td>
              <td>{capitalize(signature.role)}</td>
              <td>{signature.telephone}</td>
              <td>{signature.cellphone}</td>
              <td className="button">
                <Button
                  color="primary-outline"
                  size="small"
                  onClick={() => handleOpenModal(signature.id)}
                >
                  <BiEditAlt size={20} />
                  <span className="hide-lg-down">Editar</span>
                </Button>
              </td>
              <td className="button">
                <Button
                  color="primary-outline"
                  size="small"
                  onClick={() => handleSendMail(signature.id)}
                >
                  <BiMailSend size={20} />
                  <span className="hide-lg-down">Enviar</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </PaginatedTable>
      <Filters ref={filterRef} title="Filtros">
        <Form ref={formFilterRef} onSubmit={handleSaveSender}>
          <ScrollArea>
            <Input label="Nome" name="name" />
            <Input label="Email" name="email" />
            <Input label="Cargo" name="role" />
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
      {openModal && (
        <Modal open={openModal} onClose={handleCloseModal} size="md">
          <SignatureForm
            id={signatureId}
            onClose={handleCloseModal}
            formRef={formRef}
          />
        </Modal>
      )}
    </Container>
  )
}

export default SignatureList
