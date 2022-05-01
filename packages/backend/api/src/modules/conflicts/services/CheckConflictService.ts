import uploadConfig from '@config/upload'
import ILoggerProvider from '@shared/adapters/models/ILoggerProvider'
import db from '@shared/infra/knex'
import getCustomers from '@shared/infra/knex/queries/getCustomers'
import axios from 'axios'
import { Workbook } from 'exceljs'
import { JSDOM } from 'jsdom'
import path from 'path'
import { stringify } from 'qs'
import { inject, injectable } from 'tsyringe'

import Conflict from '../infra/typeorm/entities/Conflict'
import IConflictExecutionsRepository from '../repositories/IConflictExecutionsRepository'
import IConflictsRepository from '../repositories/IConflictsRepository'

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

  public async execute(): Promise<void> {
    const execution = await this.conflictExecutionsRepository.create()
    const rows = []
    let i = 1
    const customers = await db.raw<Conflict[]>(getCustomers)
    for (const customer of customers) {
      customer.simple_national = !!customer.simple_national
      customer.execution = execution
      try {
        this.loggerProvider.log(
          'info',
          `Processando: ${i++} de ${customers.length}\nCNPJ: ${customer.cnpj}`,
          {
            action: '@modules/conflicts/services/CheckConflictService'
          }
        )

        const { data } = await axios.post(
          'http://www.sefaz.ba.gov.br/Sintegra/Result.asp',
          stringify({
            txt_CNPJ: customer.cnpj
          }),
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
          }
        )
        const doc = new JSDOM(data)
        let status_sefaz = false
        const array = doc.window.document.querySelectorAll('font')
        array.forEach((element: any) => {
          if (element.innerHTML.includes('SIMPLES NACIONAL')) {
            status_sefaz = true
          }
        })
        if (
          (status_sefaz && !customer.simple_national) ||
          (!status_sefaz && customer.simple_national)
        ) {
          const {
            code,
            name,
            cnpj,
            code_salesman,
            name_salesman,
            code_coordinator,
            name_coordinator,
            simple_national
          } = await this.conflictsRepository.create(customer)
          rows.push([
            code,
            name,
            cnpj,
            code_salesman,
            name_salesman,
            code_coordinator,
            name_coordinator,
            simple_national ? 'Não' : 'Sim',
            ''
          ])
        }
      } catch (err) {
        this.loggerProvider.log('error', customer.cnpj, {
          action: '@modules/conflicts/services/CheckConflictService',
          err,
          message: err.message,
          stack: err.stack?.split('\n')
        })
      }
    }

    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Conflitos de cadastro')
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
        { name: 'CNJP', filterButton: true },
        { name: 'Código Vendedor', filterButton: true },
        { name: 'Nome Vendedor', filterButton: true },
        { name: 'Código Coordenador', filterButton: true },
        { name: 'Nome Coordenador', filterButton: true },
        { name: 'Simples Nacional', filterButton: true },
        { name: 'Obs.:', filterButton: true }
      ],
      rows
    })
    const tmpName = `conflict_${new Date().getTime()}.xlsx`
    await workbook.xlsx.writeFile(
      path.resolve(uploadConfig.tmpDir, 'spreadsheets', tmpName)
    )

    execution.running = false
    execution.url = `/spreadsheets/${tmpName}`
    await this.conflictExecutionsRepository.save(execution)
  }
}

export default CheckConflictService
