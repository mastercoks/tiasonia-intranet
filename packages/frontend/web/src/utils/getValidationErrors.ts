import { ValidationError } from 'yup'

interface Errors {
  [key: string]: string
}

const getValidationErrors = (err: ValidationError): Errors => {
  const validationErrors: Errors = {}

  err.inner.forEach(error => {
    const index = error?.path
    if (index) validationErrors[index] = error.message
  })

  return validationErrors
}

export default getValidationErrors
