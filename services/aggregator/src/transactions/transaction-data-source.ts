import { Injectable, Logger } from '@nestjs/common';
import { DefaultService, OpenAPI } from '../generated/transaction-api';

@Injectable()
export class TransactionDataSource {
  private readonly logger = new Logger(TransactionDataSource.name);

  constructor() {
    OpenAPI.BASE = 'http://localhost:3000';
  }

  async getTransactions(startDate: Date, endDate: Date) {
    try {
      // Use the static method instead of instance method
      return await DefaultService.getTransactions(
        startDate.toISOString(),
        endDate.toISOString(),
      );
    } catch (error) {
      this.logger.error(`Failed to fetch transactions: ${error.message}`);
      throw error;
    }
  }
}