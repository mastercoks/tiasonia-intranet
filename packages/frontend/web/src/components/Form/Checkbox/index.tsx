import { useField } from '@unform/core'
import { useCallback, useEffect, useRef } from 'react'

import {
  OptionsContainer,
  CheckboxContainer,
  CheckboxStyled,
  Label
} from './styles'

interface Option {
  id: string
  label?: string
}

interface Props extends React.InputHTMLAttributes<any> {
  name: string
  options: Option[]
}

const Checkbox: React.FC<Props> = ({ name, options, ...rest }) => {
  const refs = useRef<Array<HTMLInputElement>>([])
  const { fieldName, registerField, clearError } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: refs.current,
      getValue: (ref: any) => {
        return ref
          ?.filter((item: any) => item.checked)
          .map((item: any) => item.id)
      },
      setValue: (ref: any, value: any) => {
        if (!Array.isArray(value)) {
          return []
        }
        return ref.forEach((item: any) =>
          value.includes(item.id)
            ? (item.checked = true)
            : (item.checked = false)
        )
      }
    })
  }, [fieldName, registerField, refs])

  const addRefItem = useCallback((ref: any) => {
    if (!!ref && !refs.current.includes(ref)) {
      refs.current.push(ref)
    }
  }, [])

  return (
    <OptionsContainer>
      {options.map(option => {
        const id = option.id
        return (
          <CheckboxContainer key={id}>
            <CheckboxStyled
              {...rest}
              type="checkbox"
              id={id}
              aria-label={id}
              onFocus={clearError}
              ref={addRefItem}
            />
            <Label id={id}>{option.label}</Label>
          </CheckboxContainer>
        )
      })}
    </OptionsContainer>
  )
}
export default Checkbox
