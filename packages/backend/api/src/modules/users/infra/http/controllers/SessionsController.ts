import AuthenticateUserService from '@modules/users/services/AuthenticateUserService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { login, password } = req.body
    const authenticateUser = container.resolve(AuthenticateUserService)

    const { token } = await authenticateUser.execute({
      login,
      password
    })

    return res.json({ token })
  }
}

export default SessionsController
