import { FormHandles } from '@unform/core'
import { useCallback, useRef, useState } from 'react'
import { BiEditAlt, BiFilterAlt, BiPlus } from 'react-icons/bi'

import Button from '../../../components/Button'
import Filters, { FilterHandles } from '../../../components/Filters'
import { Form, Input } from '../../../components/Form'
import Header from '../../../components/Header'
import Modal from '../../../components/Modal'
import PaginatedTable from '../../../components/PaginatedTable'
import usePaginatedRequest from '../../../services/usePaginatedRequest'
import capitalize from '../../../utils/capitalize'
import CompanyForm from '../CompanyForm'
import { Container, Buttons, ScrollArea } from './styles'

interface Company {
  id: string
  name: string
  logo: string
  site: string
  group: string
  disclaimer: string
}

const CompanyList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false)
  const [filters, setFilters] = useState(null)
  const [companyId, setCompanyId] = useState(null)
  const formRef = useRef<FormHandles>(null)
  const filterRef = useRef<FilterHandles>(null)
  const formFilterRef = useRef<FormHandles>(null)

  const request = usePaginatedRequest<Company[]>({
    url: `/signatures/companies`,
    params: filters
  })

  const handleCloseModal = useCallback(() => {
    formRef.current?.setErrors({})
    formRef.current?.reset()
    setOpenModal(false)
    request.revalidate()
  }, [request])

  const handleOpenModal = useCallback((id = undefined) => {
    setCompanyId(id)
    setOpenModal(true)
  }, [])

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
    !data.site && delete data.site
    !data.logo && delete data.logo
    !data.group && delete data.group
    !data.disclaimer && delete data.disclaimer
    setFilters(data)
  }, [])

  return (
    <Container>
      <Header>
        <h1>Empresas</h1>
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
            <th>Nome</th>
            <th>Site</th>
            <th>Grupo</th>
            <th style={{ width: 32 }} />
          </tr>
        </thead>
        <tbody>
          {request.data?.map(company => (
            <tr key={company.id}>
              <td>{capitalize(company.name)}</td>
              <td>{company.site}</td>
              <td>{capitalize(company.group)}</td>
              <td className="button">
                <Button
                  color="primary-outline"
                  size="small"
                  onClick={() => handleOpenModal(company.id)}
                >
                  <BiEditAlt size={20} />
                  <span className="hide-lg-down">Editar</span>
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
          <CompanyForm
            id={companyId}
            onClose={handleCloseModal}
            formRef={formRef}
          />
        </Modal>
      )}
    </Container>
  )
}

export default CompanyList
