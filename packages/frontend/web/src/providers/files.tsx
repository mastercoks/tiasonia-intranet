import React, {
  createContext,
  useCallback,
  useContext,
  useReducer
} from 'react'

import { FileProps } from '../components/File'

interface FilesContextData {
  files: FileProps[]
  isEmpty: boolean
  handleRemove(file: FileProps): void
  handleAdd(file: FileProps): void
  handleUpdate(file: FileProps, values: any): void
}

type State = {
  files: FileProps[]
}

const initialState: State = {
  files: []
}

type Action = {
  type: 'ADD_ITEM' | 'UPDATE_ITEM' | 'REMOVE_ITEM'
  file: FileProps
  values?: any
}

const fileReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_ITEM': {
      return { ...state, files: [...state.files, action.file] }
    }
    case 'UPDATE_ITEM': {
      const newFiles = state.files.map(file => {
        if (file === action.file) {
          const updatedItem = Object.assign(file, action.values)

          return updatedItem
        }

        return file
      })

      return { ...state, files: newFiles }
    }
    case 'REMOVE_ITEM': {
      const newFiles = [...state.files]
      newFiles.splice(newFiles.indexOf(action.file), 1)
      return { ...state, files: newFiles }
    }
    default:
      throw new Error()
  }
}

const FilesContext = createContext<FilesContextData>({} as FilesContextData)

const FilesProvider: React.FC = ({ children }) => {
  const [listData, dispatchListData] = useReducer(fileReducer, initialState)

  const handleRemove = useCallback((file: FileProps) => {
    dispatchListData({ type: 'REMOVE_ITEM', file })
  }, [])

  const handleAdd = useCallback((file: FileProps) => {
    dispatchListData({ type: 'ADD_ITEM', file })
  }, [])

  const handleUpdate = useCallback((file: FileProps, values: any) => {
    dispatchListData({ type: 'UPDATE_ITEM', file, values })
  }, [])

  return (
    <FilesContext.Provider
      value={{
        files: listData?.files,
        isEmpty: listData?.files.length === 0,
        handleRemove,
        handleAdd,
        handleUpdate
      }}
    >
      {children}
    </FilesContext.Provider>
  )
}

function useFiles(): FilesContextData {
  const context = useContext(FilesContext)

  if (!context) {
    throw new Error('useFiles must be used within a FilesProvider')
  }

  return context
}

export { FilesProvider, useFiles }
