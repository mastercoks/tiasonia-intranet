import { useField } from '@unform/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IconBaseProps } from 'react-icons'
import { BiErrorCircle, BiHide, BiShow } from 'react-icons/bi'
import ReactInputMask, { Props as MaskProps } from 'react-input-mask'

import {
  Container,
  InputContainer,
  LabelArea,
  IconArea,
  SecureToggle,
  ErrorArea
} from './styles'

interface Props<Multiline = false> {
  label?: string
  note?: string
  name: string
  mask?: any
  type?: any
  icon?: React.ComponentType<IconBaseProps>
  multiline?: Multiline
}

type InputProps = JSX.IntrinsicElements['input'] & Props<false>
type TextAreaProps = JSX.IntrinsicElements['textarea'] & Props<true>
type InputMaskProps = MaskProps & Props<false>
const Input: React.FC<InputMaskProps | InputProps | TextAreaProps> = ({
  label,
  note,
  name,
  mask,
  icon: Icon,
  multiline,
  ...rest
}) => {
  const { type, disabled, ...restAux } = rest
  const secure = type === 'password'
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const [isShowPass, setIsShowPass] = useState(false)
  const { fieldName, defaultValue, registerField, error } = useField(name)

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      setValue(ref: any, value) {
        if (
          ref instanceof HTMLInputElement ||
          ref instanceof HTMLTextAreaElement
        ) {
          ref.value = value
          ref.focus()
          ref.blur()
        } else {
          ref.setInputValue(value)
          ref.onFocus()
          ref.onBlur()
        }
      },
      clearValue(ref: any) {
        if (
          ref instanceof HTMLInputElement ||
          ref instanceof HTMLTextAreaElement
        ) {
          ref.value = ''
        } else {
          ref.setInputValue('')
        }
      }
    })
  }, [fieldName, registerField])

  const handleInputFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleShowPass = useCallback(() => {
    setIsShowPass(!isShowPass)
  }, [isShowPass])

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)

    setIsFilled(!!inputRef.current?.value)
  }, [])

  const checkIpValue = useCallback((value: string) => {
    const subips = value.split('.')
    if (subips.length > 4) {
      return false
    }
    const invalidSubips = subips.filter((ip: any) => {
      ip = parseInt(ip)
      return ip < 0 || ip > 255
    })
    if (invalidSubips.length !== 0) {
      return false
    }
    let emptyIpCount = 0
    subips.forEach(ip => {
      if (ip === '') {
        emptyIpCount++
      }
    })
    if (emptyIpCount > 1) {
      return false
    }
    return true
  }, [])

  const beforeMaskedValueChangeIp = useCallback(
    (newState: any, oldState: any) => {
      let value = newState.value
      const oldValue = oldState.value
      let selection = newState.selection
      let cursorPosition = selection ? selection.start : 0
      const result = checkIpValue(value)
      if (!result) {
        value = value.trim()
        // try to add . before the last char to see if it is valid ip address
        const newValue =
          value.substring(0, value.length - 1) +
          '.' +
          value.substring(value.length - 1)
        if (checkIpValue(newValue)) {
          cursorPosition++
          selection = { start: cursorPosition, end: cursorPosition }
          value = newValue
        } else {
          value = oldValue
        }
      }

      return {
        value,
        selection
      }
    },
    [checkIpValue]
  )

  const props: any = {
    ...restAux,
    onFocus: handleInputFocus,
    onBlur: handleInputBlur,
    ref: inputRef,
    id: fieldName,
    'aria-label': fieldName,
    disabled: !!disabled,
    type: isShowPass ? 'text' : type,
    mask: mask,
    defaultValue: restAux?.defaultValue || defaultValue
  }

  if (type === 'ip') {
    props.mask = '999999999999999'
    props.formatChars = { '9': '[0-9.]' }
    props.maskChar = null
    props.alwaysShowMask = null
    props.beforeMaskedValueChange = beforeMaskedValueChangeIp
  }

  return (
    <Container>
      <LabelArea>
        {label && <label htmlFor={fieldName}>{label}</label>}
        {note && <small>{note}</small>}
      </LabelArea>
      <InputContainer
        isErrored={!!error}
        isFilled={isFilled}
        isFocused={isFocused}
        isIcon={!!Icon}
        isDisabled={!!disabled}
      >
        {Icon && (
          <IconArea>
            <Icon size={24} />
          </IconArea>
        )}

        {mask || type === 'ip' ? (
          <ReactInputMask {...(props as InputMaskProps)} />
        ) : multiline ? (
          <textarea {...(props as TextAreaProps)} />
        ) : (
          <input {...(props as InputProps)} />
        )}
        {secure && (
          <SecureToggle onClick={handleShowPass}>
            {isShowPass ? <BiShow size={24} /> : <BiHide size={24} />}
          </SecureToggle>
        )}
      </InputContainer>
      {error && (
        <ErrorArea>
          <BiErrorCircle size={24} />
          <span>{error}</span>
        </ErrorArea>
      )}
    </Container>
  )
}

export default Input
