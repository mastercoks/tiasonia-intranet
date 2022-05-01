import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef } from 'react'
import { BiArrowBack, BiScan, BiUndo } from 'react-icons/bi'
import { RouteComponentProps } from 'react-router-dom'
import * as Yup from 'yup'

import Button from '../../../components/Button'
import Filters, { FilterHandles } from '../../../components/Filters'
import { Input, Select } from '../../../components/Form'
import Header from '../../../components/Header'
import PaginatedTable from '../../../components/PaginatedTable'
import { useLoading } from '../../../providers/loading'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import usePaginatedRequest from '../../../services/usePaginatedRequest'
import getValidationErrors from '../../../utils/getValidationErrors'
import { Container, Buttons, ScrollArea } from './styles'

interface IRequest {
  number: string
  returned: boolean
  user_id: string
}

interface Card {
  id: string
  number: string
  active: boolean
  given_in: Date
  returned_on: Date
  user_id: string
}

interface RouteParams {
  id: string
}

interface RouteState {
  name: string
}

type Props = RouteComponentProps<RouteParams, any, RouteState>

const CollaboratorCards: React.FC<Props> = ({ history, match, location }) => {
  const formRef = useRef<FormHandles>(null)
  const modalRef = useRef<FilterHandles>(null)
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()
  const { id } = match.params
  const { search } = location
  const query = new URLSearchParams(search)

  const request = usePaginatedRequest<any>({
    url: `/cards/${id}`
  })

  const navigateToList = useCallback(() => {
    history.push('/access-control/collaborators')
  }, [history])

  const handleOpen = useCallback(() => {
    request.resetPage()
    modalRef.current?.toggleModal(true)
  }, [request])

  const handleReturned = useCallback(
    async ({ id, returned_on }: Card) => {
      if (returned_on) {
        addToast({
          type: 'info',
          title: 'Este cartão já foi devolvido'
        })
      } else {
        try {
          loadStart()
          const response = await api.get(`/cards/${id}/returned`)
          const { number } = response.data
          addToast({
            type: 'success',
            title: 'Cartão devolvido',
            description: `O cartão ${number} foi devolvido com sucesso.`
          })
          request.revalidate()
          loadFinish()
        } catch (err) {
          loadFinish()
          addToast({
            type: 'error',
            title: 'Erro na devolução',
            description: err
          })
        }
      }
    },
    [addToast, request, loadStart, loadFinish]
  )

  const handleSaveSender = useCallback(
    async (data: IRequest) => {
      try {
        loadStart()
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          number: Yup.string()
            .matches(/^[0-9]{10}$/, 'O número tem 10 digitos')
            .required('O número é obrigatório'),
          returned: Yup.bool()
            .required('O devolvido é obrigatório')
            .oneOf([true, false], 'O devolvido é obrigatório')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        data.user_id = id

        const response = await api.post('/cards', data)
        const { number } = response.data

        addToast({
          type: 'success',
          title: 'Cartão cadastrado',
          description: `O Cartão ${number} foi cadastrado com sucesso.`
        })
        modalRef.current?.toggleModal(false)
        request.revalidate()
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
          title: `Erro ${id ? 'na alteração' : 'no cadastro'}`,
          description: err
        })
      }
    },
    [id, addToast, request, loadStart, loadFinish]
  )

  return (
    <Container>
      <Header>
        <h1>Cartões de {query.get('name')}</h1>
        <div>
          <Button onClick={handleOpen} color="primary">
            <BiScan size={24} />
            <span className="hide-lg-down">Entregar</span>
          </Button>
          <Button onClick={navigateToList} color="primary">
            <BiArrowBack size={24} />
            <span className="hide-lg-down">Voltar</span>
          </Button>
        </div>
      </Header>
      <PaginatedTable request={request}>
        <thead>
          <tr>
            <th>Número</th>
            <th>Entrega</th>
            <th>Devolução</th>
            <th style={{ width: 32 }} />
          </tr>
        </thead>
        <tbody>
          {request.data?.map((card: Card) => (
            <tr key={card.id}>
              <td className={!card.active ? 'inactive' : ''}>{card.number}</td>
              <td>{new Date(card.given_in).toLocaleString()}</td>
              <td>
                {!card.returned_on ||
                  new Date(card.returned_on).toLocaleString()}
              </td>
              <td className="button">
                <Button
                  color="primary-outline"
                  size="small"
                  onClick={() => handleReturned(card)}
                >
                  <BiUndo size={20} />
                  <span className="hide-lg-down">Devolver</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </PaginatedTable>
      <Filters ref={modalRef} title="Entregar">
        <Form ref={formRef} onSubmit={handleSaveSender}>
          <ScrollArea>
            <Input label="Número" name="number" />
            <Select
              label="Devolvido"
              name="returned"
              placeholder="Selecione o tipo"
              options={[
                { value: true, label: 'Sim' },
                { value: false, label: 'Não' }
              ]}
              isSearchable={false}
            />
          </ScrollArea>
          <Buttons>
            <Button
              size="big"
              type="submit"
              color="secondary"
              loading={isLoading}
            >
              Entregar Cartão
            </Button>
          </Buttons>
        </Form>
      </Filters>
    </Container>
  )
}

export default CollaboratorCards
