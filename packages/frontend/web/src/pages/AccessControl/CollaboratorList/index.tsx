import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef, useState } from 'react'
import {
  BiEditAlt,
  BiFilterAlt,
  BiIdCard,
  BiImport,
  BiPlus
} from 'react-icons/bi'
import { useHistory } from 'react-router-dom'

import Box from '../../../components/Box'
import Button from '../../../components/Button'
import Filters, { FilterHandles } from '../../../components/Filters'
import {
  AsyncSelect,
  CreatableSelect,
  Input,
  Select
} from '../../../components/Form'
import Header from '../../../components/Header'
import Modal from '../../../components/Modal'
import PaginatedTable from '../../../components/PaginatedTable'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import usePaginatedRequest from '../../../services/usePaginatedRequest'
import theme from '../../../styles/theme'
import capitalize from '../../../utils/capitalize'
import { formatCPF } from '../../../utils/formatters'
import getTypeColor from '../../../utils/getTypeColor'
import CollaboratorForm from '../CollaboratorForm'
import { Buttons, Container, ScrollArea } from './styles'

interface Collaborator {
  id: string
  name: string
  cpf: string
  email: string
  type: string
  active: boolean
  company: string
  cost_center: CostCenter
}

interface CostCenter {
  id: string
  name: string
}

const CollaboratorList: React.FC = () => {
  const { addToast } = useToast()
  const history = useHistory()
  const filterRef = useRef<FilterHandles>(null)
  const formRef = useRef<FormHandles>(null)
  const formFilterRef = useRef<FormHandles>(null)
  const [filters, setFilters] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [userId, setUserId] = useState(null)

  const request = usePaginatedRequest<Collaborator[]>({
    url: `/users`,
    params: filters
  })

  const handleCloseModal = useCallback(() => {
    formRef.current?.setErrors({})
    formRef.current?.reset()
    setOpenModal(false)
    request.revalidate()
  }, [request])

  const navigateToCreate = useCallback((id = undefined) => {
    setUserId(id)
    setOpenModal(true)
  }, [])

  const handleOpenFilter = useCallback(() => {
    request.resetPage()
    filterRef.current?.toggleModal(true)
  }, [request])

  const handleResetForm = useCallback(() => {
    formFilterRef.current?.reset()
  }, [])

  const loadCompanies = useCallback(async search => {
    const response = await api.get<Collaborator[]>('/companies', {
      params: { company: search }
    })

    return response.data.map(user => ({
      value: user.company,
      label: capitalize(user.company)
    }))
  }, [])

  const loadCostCenters = useCallback(async search => {
    const response = await api.get<CostCenter[]>('/costCenters', {
      params: { name: search }
    })

    return response.data.map(costCenter => ({
      value: costCenter.id,
      label: capitalize(costCenter.name)
    }))
  }, [])

  const handleImportation = useCallback(() => {
    addToast({
      type: 'info',
      title: 'Executando importação',
      description: 'Os funcionários estão sendo importados'
    })
    try {
      api.head('/users/import')
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro na importação',
        description: err
      })
    }
  }, [addToast])

  const handleSaveSender = useCallback(data => {
    filterRef.current?.toggleModal(false)
    !data.number_card && delete data.number_card
    !data.name && delete data.name
    !data.cpf && delete data.cpf
    if (data.cpf) data.cpf = data.cpf.replace(/[^\d]+/g, '')
    !data.type && delete data.type
    !data.company && delete data.company
    !data.cost_center && delete data.cost_center
    setFilters(data)
  }, [])

  return (
    <Container>
      <Header>
        <h1>Colaboradores</h1>
        <div>
          <Button onClick={handleOpenFilter} color="medium-outline">
            <BiFilterAlt size={24} />
            <span className="hide-lg-down">Filtrar</span>
          </Button>
          <Button onClick={handleImportation}>
            <BiImport size={24} />
            <span className="hide-lg-down">Importar</span>
          </Button>
          <Button onClick={() => navigateToCreate()}>
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
              <th>Cpf</th>
              <th>Tipo</th>
              <th>Empresa</th>
              <th>Centro de Custo</th>
              <th style={{ width: 32 }} />
              <th style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {request.data?.map(user => (
              <tr key={user.id}>
                <td className={!user.active ? 'inactive' : ''}>
                  {capitalize(user.name)}
                </td>
                <td>{formatCPF(user.cpf)}</td>
                <td
                  style={{
                    color: theme.colors.light,
                    backgroundColor: getTypeColor(user.type)
                  }}
                >
                  {capitalize(user.type)}
                </td>
                <td>{capitalize(user.company)}</td>
                <td>{capitalize(user.cost_center.name)}</td>
                <td className="button">
                  <Button
                    color="primary-outline"
                    size="small"
                    onClick={() => navigateToCreate(user.id)}
                  >
                    <BiEditAlt size={20} />
                    <span className="hide-lg-down">Editar</span>
                  </Button>
                </td>
                <td className="button">
                  <Button
                    color="primary-outline"
                    size="small"
                    onClick={() =>
                      history.push({
                        pathname: `/access-control/collaborators/${user.id}/cards`,
                        search: `?name=${capitalize(user.name)}`
                      })
                    }
                  >
                    <BiIdCard size={20} />
                    <span className="hide-lg-down">Cartões</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </PaginatedTable>
      </Box>
      <Filters ref={filterRef} title="Filtros">
        <Form ref={formFilterRef} onSubmit={handleSaveSender}>
          <ScrollArea>
            <Input label="Cartão" name="number_card" mask="9999999999" />
            <Input label="Nome" name="name" />
            <Input label="Cpf" name="cpf" mask="999.999.999-99" />
            <Select
              label="Tipo"
              name="type"
              placeholder="Selecione o tipo"
              options={[
                { value: 'visitante', label: 'Visitante' },
                {
                  value: 'funcionario',
                  label: 'Funcionario'
                },
                { value: 'terceirizado', label: 'Terceirizado' },
                { value: 'diretor', label: 'Diretor' },
                { value: 'motorista', label: 'Motorista' }
              ]}
              isSearchable={false}
            />
            <CreatableSelect
              label="Empresa"
              name="company"
              placeholder="Selecione a empresa"
              defaultOptions
              cacheOptions={false}
              loadOptions={loadCompanies}
            />
            <AsyncSelect
              label="Centro de Custo"
              name="cost_center"
              placeholder="Selecione o tipo"
              defaultOptions
              cacheOptions={false}
              loadOptions={loadCostCenters}
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
      {openModal && (
        <Modal open={openModal} onClose={handleCloseModal} size="md">
          <CollaboratorForm
            id={userId}
            onClose={handleCloseModal}
            formRef={formRef}
          />
        </Modal>
      )}
    </Container>
  )
}

export default CollaboratorList
