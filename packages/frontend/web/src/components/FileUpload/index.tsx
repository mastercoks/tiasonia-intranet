import { useCallback, useEffect, useRef, useState } from 'react'
import { VscNewFile } from 'react-icons/vsc'

import Button from '../../components/Button'
import FileList from '../../components/FileList'
import { useFiles } from '../../providers/files'
import { useLoading } from '../../providers/loading'
import { useToast } from '../../providers/toast'
import { FileProps } from '../File'
import { Container, DropArea, InputFile } from './styles'

interface FileUploadProps {
  name: string
  label?: string
  multiple?: boolean
  onList: () => Promise<any>
  onUpload: (file: File) => Promise<any>
  onDelete: (document_id: string) => Promise<unknown>
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  label,
  multiple,
  onList,
  onUpload,
  onDelete
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const { isEmpty, handleAdd, handleRemove, handleUpdate } = useFiles()
  const refInput = useRef<HTMLInputElement>(null)
  const { addToast } = useToast()
  const { loadStart, loadFinish } = useLoading()

  const handleUpload = useCallback(
    async (file: FileProps) => {
      try {
        const res = await onUpload(file.document)
        handleUpdate(file, res.data)
      } catch (err) {
        handleRemove(file)
        addToast({
          type: 'error',
          title: 'Falha no envio do arquivo',
          description: err
        })
      }
    },
    [onUpload, handleUpdate, handleRemove, addToast]
  )

  const mapFileListToArray = useCallback((fileList: FileList) => {
    const files: FileProps[] = []
    Object.keys(fileList).forEach(
      file =>
        fileList[Number(file)].type === 'application/pdf' &&
        files.push({ document: fileList[Number(file)] })
    )
    return files
  }, [])

  const handleClick = useCallback(() => {
    refInput.current?.click()
  }, [])

  const onDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onFilesDropped = useCallback(
    (newFiles: FileProps[]) => {
      newFiles.forEach(file => {
        handleAdd(file)
        handleUpload(file)
      })
    },
    [handleAdd, handleUpload]
  )

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const files = e.dataTransfer.files
      e.preventDefault()
      if (files) onFilesDropped(mapFileListToArray(files))
      setIsDragging(false)
    },
    [onFilesDropped, mapFileListToArray]
  )

  const handleSelectFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      e.preventDefault()
      if (files) onFilesDropped(mapFileListToArray(files))
      setIsDragging(false)
    },
    [onFilesDropped, mapFileListToArray]
  )

  useEffect(() => {
    const loadData = async () => {
      loadStart()
      const res = await onList()
      res.data.forEach((file: FileProps) => {
        handleAdd(file)
      })
      loadFinish()
    }
    if (name) {
      loadData()
    }
  }, [name, onList, handleAdd, loadStart, loadFinish])

  return (
    <Container>
      {label && <label>{label}</label>}
      <FileList onDelete={onDelete} />
      <DropArea
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        isDragging={isDragging}
        isEmpty={isEmpty}
        onClick={handleClick}
      >
        <InputFile
          type="file"
          accept="application/pdf"
          tabIndex={-1}
          ref={refInput}
          name={name}
          multiple={multiple}
          onChange={handleSelectFile}
        />
        {isEmpty && <VscNewFile size={100} />}
        <span>Largue os seus ficheiros aqui{!isDragging && ' ou'}</span>
        {!isDragging && (
          <Button
            size={isEmpty ? 'default' : 'small'}
            color={isEmpty ? 'primary' : 'dark-outline'}
          >
            CARREGAR
          </Button>
        )}
      </DropArea>
    </Container>
  )
}

export default FileUpload
