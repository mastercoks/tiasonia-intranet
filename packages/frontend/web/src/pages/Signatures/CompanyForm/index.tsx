import { FormHandles } from '@unform/core'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { BiSave, BiX } from 'react-icons/bi'
import SimpleBar from 'simplebar-react'
import * as Yup from 'yup'

import placeholder from '../../../assets/placeholder.png'
import Button from '../../../components/Button'
import { Form, Input } from '../../../components/Form'
import { useLoading } from '../../../providers/loading'
import { useToast } from '../../../providers/toast'
import api from '../../../services/axios'
import capitalize from '../../../utils/capitalize'
import { REACT_APP_API_URL } from '../../../utils/environment'
import getValidationErrors from '../../../utils/getValidationErrors'
import {
  Row,
  AvatarInput,
  VisuallyHidden,
  FileLabel,
  ImagePreview
} from './styles'

import 'simplebar/dist/simplebar.min.css'

interface Props {
  id: string | null
  formRef: React.RefObject<FormHandles>
  onClose: () => void
}

const CompanyForm: React.FC<Props> = ({ id, onClose, formRef }) => {
  const { addToast } = useToast()
  const { isLoading, loadStart, loadFinish } = useLoading()
  const fileRef = useRef<HTMLInputElement>(null)
  const [{ alt, src }, setImg] = useState({
    src: placeholder,
    alt: 'Upload an Image'
  })

  const handleImg = (e: any) => {
    if (e.target.files[0]) {
      setImg({
        src: URL.createObjectURL(e.target.files[0]),
        alt: e.target.files[0].name
      })
    }
  }

  useEffect(() => {
    async function loadData() {
      loadStart()
      const response = await api.get(`/signatures/companies/${id}`)
      response.data.name = capitalize(response.data.name)
      response.data.group = capitalize(response.data.group)
      formRef.current?.setData(response.data)
      setImg({
        src: REACT_APP_API_URL + response.data.logo,
        alt: capitalize(response.data.name)
      })
      loadFinish()
    }
    if (id) {
      loadData()
    }
  }, [id, formRef, loadStart, loadFinish])

  const handleSaveSender = useCallback(
    async data => {
      try {
        const file = fileRef.current?.files?.[0]
        const formData = new FormData()

        if (file) {
          Object.keys(data).forEach(key => formData.append(key, data[key]))
          formData.append('logo', file)
        }

        loadStart()

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          site: Yup.string().required('Site é obrigatório'),
          group: Yup.string().required('Grupo é obrigatório'),
          disclaimer: Yup.string().required('Aviso legal é obrigatório')
        })

        await schema.validate(data, {
          abortEarly: false
        })
        if (id) {
          await api.put(`/signatures/companies/${id}`, file ? formData : data)
        } else {
          await api.post('/signatures/companies', file ? formData : data)
        }
        addToast({
          type: 'success',
          title: `Empresa ${id ? 'alterada' : 'cadastrada'}`,
          description: `${data.name} foi ${
            id ? 'alterada' : 'cadastrada'
          } com sucesso.`
        })
        loadFinish()
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
          title: `Erro ${id ? 'na alteração' : 'no cadastro'}`,
          description: err
        })
      }
    },
    [id, addToast, formRef, onClose, loadStart, loadFinish]
  )

  return (
    <>
      <header>
        <h2>{!id ? 'Criar' : 'Alterar'} empresa</h2>
      </header>
      <SimpleBar style={{ maxHeight: '50vh' }}>
        <Form ref={formRef} onSubmit={handleSaveSender}>
          <AvatarInput>
            <VisuallyHidden
              type="file"
              accept=".png"
              ref={fileRef}
              id="logo"
              onChange={handleImg}
            />
            <FileLabel htmlFor="logo" />
            <ImagePreview src={src} alt={alt} />
          </AvatarInput>
          <Row>
            <Input label="Nome" name="name" />
            <Input label="Site" name="site" />
            <Input label="Grupo" name="group" />
          </Row>
          <Input label="Aviso legal" name="disclaimer" multiline />
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
          <BiSave size={24} />
          <span>Salvar</span>
        </Button>
      </footer>
    </>
  )
}

export default CompanyForm
