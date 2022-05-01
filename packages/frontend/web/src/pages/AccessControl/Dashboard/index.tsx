import React from 'react'

import Header from '../../../components/Header'
import ReaderInfo from '../../../components/ReaderInfo'
import usePaginatedRequest from '../../../services/usePaginatedRequest'
import { Container, ListReaders } from './styles'

interface Reader {
  id: string
  name: string
  ip_address: string
  type: ReaderType
}

interface ReaderType {
  id: string
  name: string
}

const Dashboard: React.FC = () => {
  const request = usePaginatedRequest<Reader[]>({
    url: '/readers'
  })

  return (
    <Container>
      <Header>
        <h1>Controle de acesso</h1>
      </Header>
      <ListReaders>
        {request.data?.map((reader, key) => (
          <ReaderInfo key={key} reader={reader} />
        ))}
      </ListReaders>
    </Container>
  )
}

export default Dashboard
