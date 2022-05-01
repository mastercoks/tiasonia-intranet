import { useCallback, useState } from 'react'
import { BiX } from 'react-icons/bi'
import { VscFilePdf } from 'react-icons/vsc'

import { REACT_APP_API_URL } from '../../utils/environment'
import { humanFileSize } from '../../utils/formatters'
import Button from '../Button'
import Loader from '../Loader'
import Modal from '../Modal'
import { Container } from './styles'

export interface FileProps {
  id?: string
  name?: string
  size?: number
  url?: string
  document: File
  onRemove?: () => void
}
const File: React.FC<FileProps> = ({ name, size, url, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  return (
    <>
      <Container>
        <VscFilePdf size={40} />
        {name && url && size ? (
          <>
            <div onClick={handleOpen} style={{ cursor: 'pointer' }}>
              <span>
                <b>{name}</b>
              </span>
              <span>{humanFileSize(size)}</span>
            </div>
            <Button size="small" color="danger-outline" onClick={onRemove}>
              <BiX size={18} />
            </Button>
          </>
        ) : (
          <div>
            <span>
              <b>Carregando</b>
            </span>
            <Loader />
          </div>
        )}
      </Container>
      {name && url && size && (
        <Modal open={isOpen} onClose={handleClose} size="md">
          <header>
            <h2>{name}</h2>
            <Button
              size="small"
              color="medium-outline"
              onClick={handleClose}
              style={{ padding: '4px', border: 'none' }}
            >
              <BiX size={24} />
            </Button>
          </header>
          <iframe
            style={{ height: '80vh', marginBottom: '-4px' }}
            width="100%"
            height="100%"
            src={REACT_APP_API_URL + url}
            frameBorder="0"
          />
        </Modal>
      )}
    </>
  )
}

export default File
