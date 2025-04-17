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
    try {
      // Get existing users to check their last aggregation timestamps
      const existingUsers = await this.aggregatedTransactionRepository.find();
      const existingUsersMap = new Map(
        existingUsers.map((user) => [user.userId, user]),
      );

      const currentTimestamp = new Date();
      const transactions = await this.dataSource.getTransactions(
        new Date(0),
        currentTimestamp,
      );

      // Get all unique users from transactions
      const uniqueUserIds = [
        ...new Set(transactions.items?.map((t) => t.userId) || []),
      ];

      for (const userId of uniqueUserIds) {
        const existingUser = existingUsersMap.get(userId);
        const startDate = existingUser?.lastAggregatedAt || new Date(0);

        await this.processUserTransactions(userId, startDate, currentTimestamp);
      }
    } catch (error) {
      this.logger.error('Failed to aggregate transactions', error.stack);
      throw error;
    }
  }

  private async processUserTransactions(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    try {
      const transactions = await this.dataSource.getTransactions(
        startDate,
        endDate,
      );
      const userTransactions =
        transactions.items?.filter((t) => t.userId === userId) || [];

      if (userTransactions.length === 0) {
        this.logger.debug(`No new transactions for user ${userId}`);
        return;
      }

      // Get or create user aggregation
      let aggregation = await this.aggregatedTransactionRepository.findOne({
        where: { userId },
      });

      const isNewUser = !aggregation;
      if (isNewUser) {
        aggregation = this.aggregatedTransactionRepository.create({
          userId,
          earned: 0,
          spent: 0,
          payout: 0,
          paidOut: 0,
        });
      }

      // Process new transactions
      for (const transaction of userTransactions) {
        const amount = Number(transaction.amount) || 0;

        switch (transaction.type) {
          case 'earn':
            aggregation.earned += amount;
            break;
          case 'spend':
            aggregation.spent += amount;
            break;
          case 'payout':
            aggregation.paidOut += amount;
            break;
        }
      }

      // Update derived values
      aggregation.payout =
        aggregation.earned - aggregation.spent - aggregation.paidOut;
      aggregation.lastAggregatedAt = endDate;

      await this.aggregatedTransactionRepository.save(aggregation);

      this.logger.log(
        `${isNewUser ? 'Created' : 'Updated'} aggregation for user ${userId}:`,
        {
          earned: aggregation.earned,
          spent: aggregation.spent,
          paidOut: aggregation.paidOut,
          payout: aggregation.payout,
          lastAggregatedAt: aggregation.lastAggregatedAt,
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to process transactions for user ${userId}`,
        error.stack,
      );
      throw error;
    }
  }
}
