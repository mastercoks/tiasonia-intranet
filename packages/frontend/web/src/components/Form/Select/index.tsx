import { useField } from '@unform/core'
import React, { useRef, useEffect } from 'react'
import { BiErrorCircle } from 'react-icons/bi'
import { OptionTypeBase, Props as SelectProps } from 'react-select'

import { Container, SelectComponent, ErrorArea } from './styles'

interface Props extends SelectProps<OptionTypeBase> {
  name: string
  label?: string
  note?: string
}

const Select: React.FC<Props> = ({ name, label, note, ...rest }) => {
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
        ref.select.setValue(selected[0] || null)
      },
      getValue: (ref: any) => {
        if (rest.isMulti) {
          if (!ref.state.value) {
            return []
          }
          return ref.state.value.map((option: OptionTypeBase) => option.value)
        }
        if (!ref.state.value) {
          return ''
        }
        return ref.state.value.value
      },
      clearValue: ref => {
        ref.select.setValue(ref.props.defaultValue)
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

export default Select
