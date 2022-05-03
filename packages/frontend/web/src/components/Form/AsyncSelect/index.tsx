import { useField } from '@unform/core'
import React, { useRef, useEffect } from 'react'
import { BiErrorCircle } from 'react-icons/bi'
import { GroupBase } from 'react-select'
import { AsyncProps } from 'react-select/async'

import { Container, Select, ErrorArea } from './styles'

type OptionTypeBase = {
  label: string
  value: string
}

interface Props
  extends AsyncProps<OptionTypeBase, boolean, GroupBase<OptionTypeBase>> {
  name: string
  label?: string
  note?: string
}

export const AsyncSelect: React.FC<Props> = ({
  name,
  label,
  note,
  ...rest
}) => {
  const selectRef = useRef(null)
  const { fieldName, defaultValue, registerField, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      setValue: (ref, value) => {
        ref.setValue(value)
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
    <Container className={props.className}>
      {label && <label htmlFor={fieldName}>{label}</label>}
      {note && <small>{note}</small>}

      <Select isErrored={!!error} cacheOptions {...props} />

      {error && (
        <ErrorArea>
          <BiErrorCircle size={24} />
          <span>{error}</span>
        </ErrorArea>
      )}
    </Container>
  )
}
