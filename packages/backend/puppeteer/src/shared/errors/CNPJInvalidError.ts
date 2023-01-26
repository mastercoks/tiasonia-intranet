import AppError from './AppError'

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
class CNPJInvalidError extends AppError {
  constructor(message: string, statusCode = 412, code = 'cnpj.invalid.error') {
    super(message, statusCode, code)
  }
}

export default CNPJInvalidError
