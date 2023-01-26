import uploadConfig from '@config/upload'
import ILoggerProvider from '@shared/adapters/models/ILoggerProvider'
import db from '@shared/infra/knex'
import getCustomers from '@shared/infra/knex/queries/getCustomers'
import { PUPPETEER_HOST, PUPPETEER_PORT } from '@shared/utils/environment'
import { Workbook } from 'exceljs'
import path from 'path'
import { inject, injectable } from 'tsyringe'

import ICheckSimpleDTO from '../dtos/ICheckSimpleDTO'
import IConflictProtheusDTO from '../dtos/IConflictProtheusDTO'
import Conflict from '../infra/typeorm/entities/Conflict'
import { UFs } from '../infra/typeorm/entities/ConflictExecution'
import IConflictExecutionsRepository from '../repositories/IConflictExecutionsRepository'
import IConflictsRepository from '../repositories/IConflictsRepository'
import { api } from '../utils/api'
import { formatCNPJ } from '../utils/formatters'

@injectable()
class CheckConflictService {
  constructor(
    @inject('ConflictsRepository')
    private conflictsRepository: IConflictsRepository,
    @inject('ConflictExecutionsRepository')
    private conflictExecutionsRepository: IConflictExecutionsRepository,
    @inject('LoggerProvider')
    private loggerProvider: ILoggerProvider
  ) {}

  public async execute(uf: UFs): Promise<void> {
    const execution = await this.conflictExecutionsRepository.create(uf)
    try {
      const conflicts: string[][] = []
      const requests: string[][] = []
      const errors: string[][] = []
      let i = 1
      const customers = await db.raw<IConflictProtheusDTO[]>(getCustomers(uf))

      for (const customer of customers) {
        try {
          const url = `http://${PUPPETEER_HOST}:${PUPPETEER_PORT}/simple/${customer.cnpj}`
          this.loggerProvider.log(
            'info',
            `Processando: ${i++} de ${customers.length}\nCNPJ: ${
              customer.cnpj
            }`,
            {
              action: '@modules/conflicts/services/CheckConflictService',
              url
            }
          )
          const { data } = await api.get<ICheckSimpleDTO>(url)
          const { cnpj, isSimple, name, simei, simple } = data
          requests.push([
            formatCNPJ(customer.cnpj),
            name,
            cnpj?.trim(),
            simple,
            simei,
            isSimple ? 'Sim' : 'Não'
          ])
          if (
            (isSimple && !customer.protheus) ||
            (!isSimple && !!customer.protheus)
          ) {
            const {
              code,
              name,
              cnpj,
              code_salesman,
              name_salesman,
              code_coordinator,
              name_coordinator,
              protheus,
              simple_national
            } = await this.conflictsRepository.create({
              cnpj: customer.cnpj,
              code: customer.code,
              name: customer.name,
              code_coordinator: customer.code_coordinator,
              name_coordinator: customer.name_coordinator,
              code_salesman: customer.code_salesman,
              name_salesman: customer.name_salesman,
              protheus: !!customer.protheus,
              simple_national: isSimple,
              execution
            })
            conflicts.push([
              code,
              name,
              formatCNPJ(cnpj),
              code_salesman,
              name_salesman,
              code_coordinator,
              name_coordinator,
              protheus ? 'Sim' : 'Não',
              simple_national ? 'Sim' : 'Não',
              ''
            ])
          }
        } catch (message) {
          this.loggerProvider.log('error', customer.cnpj, {
            action: '@modules/conflicts/services/CheckConflictService',
            message
          })
          errors.push([formatCNPJ(customer.cnpj), String(message)])
        }
      }

      const workbook = new Workbook()
      let worksheet = workbook.addWorksheet('Conflitos de cadastro')
      worksheet.addTable({
        name: 'Conflitos de cadastro',
        ref: 'A1',
        style: {
          theme: 'TableStyleMedium2',
          showRowStripes: true
        },
        columns: [
          { name: 'Código-Loja', filterButton: true },
          { name: 'Nome', filterButton: true },
          { name: 'CNPJ', filterButton: true },
          { name: 'Código Vendedor', filterButton: true },
          { name: 'Nome Vendedor', filterButton: true },
          { name: 'Código Coordenador', filterButton: true },
          { name: 'Nome Coordenador', filterButton: true },
          { name: 'Protheus', filterButton: true },
          { name: 'Simples Nacional', filterButton: true },
          { name: 'Obs.:', filterButton: true }
        ],
        rows: conflicts
      })
      worksheet = workbook.addWorksheet('Requisições')
      worksheet.addTable({
        name: 'Requisições',
        ref: 'A1',
        style: {
          theme: 'TableStyleMedium2',
          showRowStripes: true
        },
        columns: [
          { name: 'CNPJ Consulta', filterButton: true },
          { name: 'Nome', filterButton: true },
          { name: 'CNPJ Matriz ', filterButton: true },
          { name: 'Simples Nacional', filterButton: true },
          { name: 'SIMEI', filterButton: true },
          { name: 'Simples?', filterButton: true }
        ],
        rows: requests
      })
      worksheet = workbook.addWorksheet('Errors ao consultar')
      worksheet.addTable({
        name: 'Errors ao consultar',
        ref: 'A1',
        style: {
          theme: 'TableStyleMedium2',
          showRowStripes: true
        },
        columns: [
          { name: 'CNPJ', filterButton: true },
          { name: 'Erro', filterButton: true }
        ],
        rows: errors
      })
      const tmpName = `conflict_${uf}_${new Date().getTime()}.xlsx`
      await workbook.xlsx.writeFile(
        path.resolve(uploadConfig.tmpDir, 'spreadsheets', tmpName)
      )

      execution.running = false
      execution.url = `/spreadsheets/${tmpName}`
      await this.conflictExecutionsRepository.save(execution)
    } catch (err) {
      const { message } = err as Error
      this.loggerProvider.log('error', 'Erro na sincronização dos conflitos', {
        action: '@modules/conflicts/services/CheckConflictService',
        message
      })
      execution.running = false
      await this.conflictExecutionsRepository.save(execution)
    }
  }
}

export default CheckConflictService
