import React, { useCallback } from 'react'
import { BiExport, BiStop, BiStopCircle, BiSync } from 'react-icons/bi'

import { Box, Header, PaginatedTable, Button } from '../../components'
import { useToast } from '../../providers'
import { api, usePaginatedRequest } from '../../services'
import { capitalize, formatCNPJ } from '../../utils'
import { Container } from './styles'

interface Conflict {
  id: string
  code: string
  name: string
  cnpj: string
  code_salesman: string
  name_salesman: string
  code_coordinator: string
  name_coordinator: string
  simple_national: boolean
}

export const Conflicts: React.FC = () => {
  const { addToast } = useToast()
  const request = usePaginatedRequest<any>({
    url: `/conflicts`
  })

  const handleSync = useCallback(async () => {
    if (request.data?.running) {
      addToast({
        type: 'info',
        title: 'Sincronização não finalizada',
        description: 'Existe uma sincronização em andamento.'
      })
      return
    }
    try {
      await api.head('/conflicts')
      addToast({
        type: 'info',
        title: 'Executando sincronização',
        description: 'Os clientes estão sendo checados no sefaz.'
      })
      request.mutate()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro na sincronização',
        description: String(err)
      })
    }
  }, [request, addToast])

  const handleStopSync = useCallback(async () => {
    if (!request.data?.running) {
      addToast({
        type: 'info',
        title: 'Sincronização finalizada',
        description: 'Não existe uma sincronização em andamento.'
      })
      return
    }
    try {
      await api.get('/conflicts/stop')
      addToast({
        type: 'info',
        title: 'Sincronização interrompida',
        description: 'Tente iniciar uma nova sincronização.'
      })
      request.mutate()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro na sincronização',
        description: String(err)
      })
    }
  }, [request, addToast])

  const handleExport = useCallback(async () => {
    if (!request.data?.url) {
      addToast({
        type: 'info',
        title: 'Download não disponível',
        description: 'Espere a sincronização finalizar.'
      })
      return
    }
    try {
      const { data } = await api.get(request.data?.url, {
        responseType: 'blob'
      })
      const downloadUrl = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', 'conflitos.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro na exportação',
        description: String(err)
      })
    }
  }, [request, addToast])

  return (
    <Container>
      <Header>
        <h1>Conflitos de cadastro</h1>
        <div>
          <Button
            color="medium-outline"
            onClick={handleExport}
            disabled={request.data && !request.data?.url}
          >
            <BiExport size={24} />
            <span className="hide-lg-down">Exportar</span>
          </Button>
          <Button
            color="primary"
            onClick={handleSync}
            disabled={request.data && request.data?.running}
          >
            <BiSync
              size={24}
              className={request.data && request.data?.running ? 'rotate' : ''}
            />
            <span className="hide-lg-down">Sincronizar</span>
          </Button>
          <Button
            color="primary"
            onClick={handleStopSync}
            disabled={!request.data?.running}
          >
            <BiStopCircle size={24} />
            <span className="hide-lg-down">Parar</span>
          </Button>
        </div>
      </Header>
      <Box>
        <PaginatedTable request={request} dataAlt={request.data?.conflicts}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CNPJ</th>
              <th>Vendedor</th>
              <th>Coordenador</th>
              <th>Simples Nacional</th>
            </tr>
          </thead>
          <tbody>
            {request.data &&
              request.data?.conflicts.map((conflict: Conflict) => {
                return (
                  <tr key={conflict.id}>
                    <td>{capitalize(conflict.name)}</td>
                    <td>{formatCNPJ(conflict.cnpj)}</td>
                    <td>{capitalize(conflict.name_salesman)}</td>
                    <td>{capitalize(conflict.name_coordinator)}</td>
                    <td>{Number(conflict.simple_national) ? 'Não' : 'Sim'}</td>
                  </tr>
                )
              })}
          </tbody>
        </PaginatedTable>
      </Box>
    </Container>
  )
}
