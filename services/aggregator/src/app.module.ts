import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionDataSource } from './transactions/transaction-data-source';
import { TransactionAggregator } from './transactions/transaction-aggregator';
import { AggregatedTransaction } from './shared/entities/aggregated-transaction.entity';
import { TransactionController } from './transactions/transaction.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '../../data/transactions.sqlite',
      entities: [AggregatedTransaction],
      synchronize: true, // disable in production
    }),
    TypeOrmModule.forFeature([AggregatedTransaction]),
  ],
  controllers: [TransactionController],
  providers: [TransactionDataSource, TransactionAggregator],
})
export class AppModule {}
