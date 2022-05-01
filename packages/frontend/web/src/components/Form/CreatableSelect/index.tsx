import { useField } from '@unform/core'
import React, { useRef, useEffect } from 'react'
import { BiErrorCircle } from 'react-icons/bi'
import { OptionTypeBase, GroupTypeBase } from 'react-select'
import { Props as CreatableProps } from 'react-select/async-creatable'

import { Container, CreatableSelectComponent, ErrorArea } from './styles'

interface Props
  extends CreatableProps<
    OptionTypeBase,
    boolean,
    GroupTypeBase<OptionTypeBase>
  > {
  name: string
  label?: string
  note?: string
}

const CreatableSelect: React.FC<Props> = ({ name, label, note, ...rest }) => {
  const selectRef = useRef(null)
  const { fieldName, defaultValue, registerField, error } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      setValue: (ref, value) => {
        ref.select.select.select.setValue(value)
      },
      getValue: (ref: any) => {
        if (rest.isMulti) {
          if (!ref.select.state.value) {
            return []
          }

          return ref.select.state.value.map(
            (option: OptionTypeBase) => option.value
          )
        }
        if (!ref.select.state.value) {
          return ''
        }

        return ref.select.state.value.value
      },
      clearValue: ref => {
        ref.select.select.select.clearValue()
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

      <CreatableSelectComponent isErrored={!!error} cacheOptions {...props} />

      {error && (
        <ErrorArea>
          <BiErrorCircle size={24} />
          <span>{error}</span>
        </ErrorArea>
      )}
    </Container>
  )
}

export default CreatableSelect
