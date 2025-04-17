import { Injectable } from '@nestjs/common'
import { TransactionsService, Configuration } from '../generated/transaction-api'

@Injectable()
export class TransactionApiClient {
  private api: TransactionsService

  constructor() {
    const config = new Configuration({
      basePath: 'http://localhost:3000',
    })
    this.api = new TransactionsService(config)
  }

  async getTransactions(startDate: string, endDate: string) {
    return this.api.getTransactions({ startDate, endDate })
  }
}