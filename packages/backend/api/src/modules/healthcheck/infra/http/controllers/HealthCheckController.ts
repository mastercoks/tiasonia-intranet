import { Request, Response } from 'express'

class HealthCheckController {
  public async show(req: Request, res: Response): Promise<Response> {
    const healthCheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
    }
    try {
      return res.status(200).send(healthCheck)
    } catch (e) {
      healthCheck.message = e
      res.status(503).send(healthCheck)
    }
  }
}

export default HealthCheckController
