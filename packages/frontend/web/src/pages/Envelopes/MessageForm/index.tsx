import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { useCallback, useRef } from 'react'
import { BiSend, BiX } from 'react-icons/bi'
import SimpleBar from 'simplebar-react'
import * as Yup from 'yup'

import Button from '../../../components/Button'
import { Input } from '../../../components/Form'
import { useLoading } from '../../../providers/loading'
import { useToast } from '../../../providers/toast'
import getValidationErrors from '../../../utils/getValidationErrors'

import 'simplebar/dist/simplebar.min.css'

interface Props {
  onSubmit: (data: any) => void
  onClose: () => void
  required?: boolean
}

const MessageForm: React.FC<Props> = ({ onSubmit, onClose, required }) => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()

  const handleSaveSender = useCallback(
    async data => {
      try {
        loadStart()
        const schema = Yup.object().shape({
          message: Yup.string().required('Mensagem é obrigatória')
        })
        if (required) {
          await schema.validate(data, {
            abortEarly: false
          })
        }
        onSubmit({ status, message: data.message })
        onClose()
      } catch (err) {
        loadFinish()
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
          return
        }
        addToast({
          type: 'error',
          title: 'Erro no envio',
          description: err
        })
        onClose()
      }
    },
    [addToast, onSubmit, onClose, loadStart, loadFinish, required]
  )
  return (
    <>
      <header>
        <h2>Justificativa</h2>
      </header>
      <SimpleBar style={{ maxHeight: '50vh' }}>
        <Form ref={formRef} onSubmit={handleSaveSender}>
          <Input label="Mensagem" name="message" multiline />
        </Form>
      </SimpleBar>
      <footer>
        <Button size="big" color="primary-outline" onClick={onClose}>
          <BiX size={24} />
          <span>Cancelar</span>
        </Button>
        <Button
          loading={isLoading}
          size="big"
          onClick={() => formRef.current?.submitForm()}
        >
          <BiSend size={24} />
          <span>Enviar</span>
        </Button>
      </footer>
    </>
  )
}

export default MessageForm
