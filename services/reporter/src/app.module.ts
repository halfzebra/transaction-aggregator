import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transactions/transaction.controller';
import { TransactionService } from './transactions/transaction.service';
import { AggregatedTransaction } from './shared/entities/aggregated-transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '../../data/transactions.sqlite',
      entities: [AggregatedTransaction],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([AggregatedTransaction]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class AppModule {}
