import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionDataSource } from './transaction-data-source';
import { AggregatedTransaction } from '../shared/entities/aggregated-transaction.entity';

@Injectable()
export class TransactionAggregator {
  private readonly logger = new Logger(TransactionAggregator.name);

  constructor(
    @InjectRepository(AggregatedTransaction)
    private readonly aggregatedTransactionRepository: Repository<AggregatedTransaction>,
    private readonly dataSource: TransactionDataSource,
  ) {}

  async aggregateTransactions(): Promise<void> {
    // Get existing aggregations to track last processed time per user
    const existingAggregations = await this.aggregatedTransactionRepository.find();
    const lastAggregatedAt = new Map(
      existingAggregations.map(agg => [agg.userId, agg.lastAggregatedAt])
    );

    const transactions = await this.dataSource.getTransactions();
    const userTransactions = new Map();

    for (const transaction of transactions) {
      const userId = transaction.userId;
      const lastProcessed = lastAggregatedAt.get(userId);

      // Skip transactions that were already processed
      if (lastProcessed && new Date(transaction.timestamp) <= lastProcessed) {
        continue;
      }

      if (!userTransactions.has(userId)) {
        // Start with existing totals or initialize new
        const existing = existingAggregations.find(a => a.userId === userId);
        userTransactions.set(userId, {
          userId,
          earned: existing?.earned ?? 0,
          spent: existing?.spent ?? 0,
          payout: existing?.payout ?? 0,
          paidOut: existing?.paidOut ?? 0,
        });
      }

      const userStats = userTransactions.get(userId);

      switch (transaction.type) {
        case 'earn':
          userStats.earned += transaction.amount;
          break;
        case 'spend':
          userStats.spent += transaction.amount;
          break;
        case 'payout':
          userStats.paidOut += transaction.amount;
          break;
      }

      // Recalculate available payout
      userStats.payout = userStats.earned - userStats.spent - userStats.paidOut;
    }

    // Update database only for users with new transactions
    for (const stats of userTransactions.values()) {
      await this.aggregatedTransactionRepository.save(stats);
      this.logger.log(`Updated aggregation for user ${stats.userId}`);
    }
  }
}
