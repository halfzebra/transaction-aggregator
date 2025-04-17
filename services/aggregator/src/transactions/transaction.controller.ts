import { Controller, Post } from '@nestjs/common';
import { TransactionAggregator } from './transaction-aggregator';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly aggregator: TransactionAggregator) {}

  @Post('aggregate')
  async triggerAggregation() {
    const result = await this.aggregator.aggregateTransactions();
    return { status: 'success', result };
  }
}