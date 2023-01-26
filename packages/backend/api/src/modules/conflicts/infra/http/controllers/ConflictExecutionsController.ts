import ListConflictExecutionService from '@modules/conflicts/services/ListConflictExecutionService'
import { classToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class ConflictExecutionsController {
  public async list(req: Request, res: Response): Promise<Response> {
    const { page = 1, per_page = 10 } = req.query

    const listExecutionService = container.resolve(ListConflictExecutionService)

    const { executions, totalCount } = await listExecutionService.execute({
      page: Number(page),
      per_page: Number(per_page)
    })

    res.header('X-Total-Count', String(totalCount))
    res.header('X-Total-Page', String(Math.ceil(totalCount / Number(per_page))))

    return res.status(200).json(classToClass(executions))
  }
}

export default ConflictExecutionsController
