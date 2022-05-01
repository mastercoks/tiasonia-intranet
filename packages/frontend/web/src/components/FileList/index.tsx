import { useFiles } from '../../providers/files'
import { useToast } from '../../providers/toast'
import File from '../File'
import { Container } from './styles'

interface FileListProps {
  onDelete: (document_id: string) => Promise<unknown>
}

const FileList: React.FC<FileListProps> = ({ onDelete }) => {
  const { addToast } = useToast()
  const { files, handleRemove } = useFiles()
  return (
    <Container>
      {files?.map((file, index) => {
        const handleRemoveItem = async () => {
          if (file?.id) {
            try {
              await onDelete(file.id)
              handleRemove(file)
            } catch (err) {
              addToast({
                type: 'error',
                title: 'Falha ao excluir o arquivo',
                description: err
              })
            }
          }
        }
        return (
          <File
            key={index}
            id={file.id}
            name={file.name}
            url={file.url}
            size={file.size}
            document={file.document}
            onRemove={handleRemoveItem}
          />
        )
      })}
    </Container>
  )
}

export default FileList
