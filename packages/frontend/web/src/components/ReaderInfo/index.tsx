import React, { useCallback, useEffect, useState } from 'react'
import {
  BiBroadcast,
  BiLoader,
  BiPowerOff,
  BiWifi,
  BiWifiOff
} from 'react-icons/bi'

import { useToast } from '../../providers/toast'
import api from '../../services/axios'
import useReaderRequest from '../../services/useReaderRequest'
import capitalize from '../../utils/capitalize'
import getTypeColor from '../../utils/getTypeColor'
import Button from '../Button'
import Modal from '../Modal'
import Tooltip from '../Tooltip'
import { Container, IconArea } from './styles'

interface ReaderInfoProps {
  reader: Reader
}

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

interface Info {
  database: string
  message: string
  timestamp: Date
  uptime: number
  services: [
    {
      name: string
      status: string
      message: string
      timestamp: Date
      uptime: number
    }
  ]
}

const ReaderInfo: React.FC<ReaderInfoProps> = ({ reader }) => {
  const [openModal, setOpenModal] = useState(false)
  const [online, setOnline] = useState(false)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Info>()
  const { addToast } = useToast()
  const request = useReaderRequest<Info>({
    url: `http://${reader?.ip_address}:3030/healthcheck`
  })

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      if (request?.data) {
        setData(request?.data)
        setOnline(true)
        setLoading(false)
      } else if (request?.error || !request?.isValidating) {
        setOnline(false)
        setLoading(false)
      }
    }
    loadData()
  }, [request])

  const Icon = loading ? BiLoader : online ? BiWifi : BiWifiOff

  const handleOpenModal = useCallback(() => {
    if (!request?.error && !loading) setOpenModal(true)
  }, [request?.error, loading])
  const handleCloseModal = useCallback(() => {
    setOpenModal(false)
  }, [])

  const getUptime = (uptime: number) => {
    const days = String(Math.floor(uptime / 86400))
    uptime -= Number(days) * 86400
    const hours = String(Math.floor(uptime / 3600))
    uptime -= Number(hours) * 3600
    const minutes = String(Math.floor(uptime / 60))
    uptime -= Number(minutes) * 60
    const seconds = String(Math.floor(uptime))

    return (
      (days !== '0' ? `${days} dia` : '') +
      (Number(days) > 1 ? 's ' : ' ') +
      (hours !== '0' ? `${hours} hora` : '') +
      (Number(hours) > 1 ? 's ' : ' ') +
      (minutes !== '0' ? `${minutes} minuto` : '') +
      (Number(minutes) > 1 ? 's ' : ' ') +
      (seconds !== '0' ? `${seconds} segundo` : '') +
      (Number(seconds) > 1 ? 's' : '')
    )
  }

  const handleRestartService = useCallback(
    (service: string) => {
      api.head(`http://${reader?.ip_address}:3030/services/${service}/restart`)
      addToast({
        type: 'info',
        title: `O serviço ${service} está sendo reiniciado`,
        description: 'Aguarde alguns segundos.'
      })
    },
    [addToast, reader?.ip_address]
  )

  return (
    <>
      <Container onClick={handleOpenModal}>
        <IconArea state={loading ? 'loading' : online ? 'online' : 'offline'}>
          <Icon size={24} />
        </IconArea>
        <div>
          <h5>
            <span
              style={{
                backgroundColor: getTypeColor(reader?.type?.name)
              }}
            >
              {capitalize(reader?.type?.name)}
            </span>
          </h5>
          <h3>{capitalize(reader?.name)}</h3>
          <h4>{loading ? 'Carregando' : online ? 'Online' : 'Offline'}</h4>
        </div>
      </Container>
      <Modal open={openModal} onClose={handleCloseModal}>
        <>
          <header>
            <h2>{capitalize(reader.name)}</h2>
          </header>
          <main>
            <fieldset>
              <div>
                <Tooltip title={data?.message || ''}>
                  <IconArea
                    state={
                      data?.database === 'connected' ? 'online' : 'offline'
                    }
                    size={8}
                  >
                    <BiBroadcast size={20} />
                  </IconArea>
                </Tooltip>
                <span>Banco de dados</span>
              </div>
              <label>{getUptime(data?.uptime || 0)}</label>
            </fieldset>
            {data?.services.map((service, key) => (
              <div key={key}>
                <fieldset>
                  <div>
                    <Tooltip title={service?.message}>
                      <IconArea
                        state={
                          service?.status === 'active' ? 'online' : 'offline'
                        }
                        size={8}
                      >
                        <BiBroadcast size={20} />
                      </IconArea>
                    </Tooltip>
                    <span>{capitalize(service?.name)}</span>
                    <Button
                      color="danger"
                      onClick={() => handleRestartService(service?.name)}
                    >
                      <BiPowerOff size={20} />
                      <span className="hide-sm-down">Reiniciar</span>
                    </Button>
                  </div>
                  <label>{getUptime(service?.uptime)}</label>
                </fieldset>
              </div>
            ))}
          </main>
        </>
      </Modal>
    </>
  )
}

export default ReaderInfo
