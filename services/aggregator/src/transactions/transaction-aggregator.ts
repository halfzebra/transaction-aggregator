import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { TransactionDataSource } from './transaction-data-source';
import { AggregatedTransaction } from '../shared/entities/aggregated-transaction.entity';

@Injectable()
export class TransactionAggregator {
  private readonly logger = new Logger(TransactionAggregator.name);

  constructor(
    @InjectRepository(AggregatedTransaction)
    private transactionsRepository: Repository<AggregatedTransaction>,
    private readonly dataSource: TransactionDataSource,
  ) {}

  async aggregateTransactions() {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 2 * 60 * 1000);

    try {
      const response = await this.dataSource.getTransactions(startDate, endDate);
      const items = response?.items ?? [];

      for (const transaction of items) {
        if (!transaction.userId) {
          this.logger.warn('Transaction without userId, skipping');
          continue;
        }

        const aggregation = {
          userId: transaction.userId,
          earned: transaction.type === 'earned' ? transaction.amount : 0,
          spent: transaction.type === 'spent' ? transaction.amount : 0,
          payout: transaction.type === 'payout' ? transaction.amount : 0,
          paidOut: 0,
        };

        await this.upsertAggregation(transaction.userId, aggregation);
      }
    } catch (error) {
      this.logger.error(`Failed to aggregate transactions: ${error.message}`);
      throw error;
    }
  }

  async upsertAggregation(
    userId: string,
    data: Partial<AggregatedTransaction>,
  ) {
    const existing = await this.transactionsRepository.findOne({
      where: { userId },
    });

    if (existing) {
      return this.transactionsRepository.update({ userId }, data);
    }

    return this.transactionsRepository.save({
      userId,
      ...data,
    });
  }

  async findByUserId(userId: string) {
    return this.transactionsRepository.findOne({
      where: { userId },
    });
  }

  async findAllPayouts() {
    return this.transactionsRepository.find({
      where: {
        payout: MoreThan(0),
      },
      select: ['userId', 'payout'],
    });
  }
}
