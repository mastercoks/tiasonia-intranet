import { useField } from '@unform/core'
import React, { useRef, useEffect } from 'react'
import { BiErrorCircle } from 'react-icons/bi'
import { Props as SelectProps } from 'react-select'

import { Container, SelectComponent, ErrorArea } from './styles'

type OptionTypeBase = {
  label: string
  value: string | boolean
}

interface Props extends SelectProps<OptionTypeBase> {
  name: string
  label?: string
  note?: string
}

export const Select: React.FC<Props> = ({ name, label, note, ...rest }) => {
  const selectRef = useRef(null)
  const { fieldName, defaultValue, registerField, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      setValue: (ref, value) => {
        const selected = ref.props.options.filter(
          (option: any) => option.value === value
        )
        ref.setValue(selected[0] || null)
      },
      getValue: ref => {
        if (rest.isMulti) {
          if (!ref.state.selectValue) {
            return []
          }

          return ref.state.selectValue.map(
            (option: OptionTypeBase) => option.value
          )
        }
        if (!ref.state.selectValue) {
          return ''
        }
        return ref.state.selectValue[0].value
      },
      clearValue: ref => {
        ref.clearValue()
      }
    })
  }, [fieldName, registerField, rest.isMulti])

  const props = {
    noOptionsMessage: () => 'Nenhuma opção',
    formatCreateLabel: (text: string) => `Criar "${text}"`,
    captureMenuScroll: false,
    defaultValue: defaultValue,
    ref: selectRef,
    classNamePrefix: 'react-select',
    isClearable: true,
    menuPlacement: 'auto',
    menuPosition: 'fixed',
    ...rest,
    theme: undefined
  }

  return (
    <Container>
      {label && <label htmlFor={fieldName}>{label}</label>}
      {note && <small>{note}</small>}

      <SelectComponent isErrored={!!error} cacheOptions {...props} />

      {error && (
        <ErrorArea>
          <BiErrorCircle size={24} />
          <span>{error}</span>
        </ErrorArea>
      )}
    </Container>
  )
}
