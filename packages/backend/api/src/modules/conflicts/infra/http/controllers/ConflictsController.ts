import CheckConflictService from '@modules/conflicts/services/CheckConflictService'
import ListConflictService from '@modules/conflicts/services/ListConflictService'
import StopConflictService from '@modules/conflicts/services/StopConflictService'
import { classToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class ConflictsController {
  public async list(req: Request, res: Response): Promise<Response> {
    const { page, per_page = 10, execution_id = '' } = req.query

    const listConflictService = container.resolve(ListConflictService)

    const { execution, totalCount } = await listConflictService.execute({
      page: Number(page),
      per_page: Number(per_page),
      execution_id: String(execution_id)
    })

    res.header('X-Total-Count', String(totalCount))
    res.header('X-Total-Page', String(Math.ceil(totalCount / Number(per_page))))

    return res.status(200).json(classToClass(execution))
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const checkConflictService = container.resolve(CheckConflictService)
    checkConflictService.execute()
    return res.status(204).send()
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const stopConflictService = container.resolve(StopConflictService)
    const execution = await stopConflictService.execute()
    return res.status(200).json(classToClass(execution))
  }
}

export default ConflictsController
