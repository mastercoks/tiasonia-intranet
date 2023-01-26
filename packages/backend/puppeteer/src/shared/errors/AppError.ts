/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
class AppError {
  public readonly message: string

  public readonly statusCode: number

  public readonly code: string

  constructor(message: string, statusCode = 501, code = 'app.error') {
    this.message = message
    this.statusCode = statusCode
    this.code = code
  }
}

export default AppError
