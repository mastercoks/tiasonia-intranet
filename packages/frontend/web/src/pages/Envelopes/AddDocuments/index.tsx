import { useCallback } from 'react'
import { BiArrowBack, BiRightArrowAlt } from 'react-icons/bi'
import { RouteComponentProps } from 'react-router-dom'

import Button from '../../../components/Button'
import FileUpload from '../../../components/FileUpload'
import { ButtonsRight } from '../../../components/Form'
import Header from '../../../components/Header'
import { FilesProvider, useFiles } from '../../../providers/files'
import api from '../../../services/axios'
import { Container } from './styles'

interface RouteParams {
  id: string
}

interface FormProps {
  id: string
  onNextPage(): void
}

const Form: React.FC<FormProps> = ({ id, onNextPage }) => {
  const { isEmpty } = useFiles()

  const uploadFileToServer = useCallback(
    (file: File): Promise<any> => {
      const formData = new FormData()
      if (file) {
        formData.append('document', file)
      }
      return api.post(`/envelopes/${id}/documents`, formData)
    },
    [id]
  )

  const deleteFileToServer = useCallback(
    (document_id: string): Promise<unknown> => {
      return api.delete(`/envelopes/${id}/documents/${document_id}`)
    },
    [id]
  )

  const listFileToServer = useCallback((): Promise<unknown> => {
    return api.get(`/envelopes/${id}/documents`)
  }, [id])

  return (
    <>
      <FileUpload
        name="documents"
        multiple
        onList={listFileToServer}
        onUpload={uploadFileToServer}
        onDelete={deleteFileToServer}
      />
      <ButtonsRight>
        <Button disabled={isEmpty} onClick={onNextPage}>
          <BiRightArrowAlt size={24} />
          <span>Próximo</span>
        </Button>
      </ButtonsRight>
    </>
  )
}

const AddDocuments: React.FC<RouteComponentProps<RouteParams>> = ({
  history,
  match
}) => {
  const { id } = match.params

  const handleNextPage = useCallback(() => {
    history.push(`/envelopes/${id}/recipients`)
  }, [history, id])

  return (
    <Container>
      <Header>
        <h1>Adicionar documentos</h1>
        <div>
          <Button
            onClick={() => {
              history.push('/envelopes')
            }}
            color="primary"
          >
            <BiArrowBack size={24} />
            <span className="hide-lg-down">Voltar</span>
          </Button>
        </div>
      </Header>
      <FilesProvider>
        <Form id={id} onNextPage={handleNextPage} />
      </FilesProvider>
    </Container>
  )
}

export default AddDocuments
