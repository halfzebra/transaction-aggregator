import { DataSourceOptions } from 'typeorm';
import { AggregatedTransaction } from '../../../../shared/entities/aggregated-transaction.entity';

export const databaseConfig: DataSourceOptions = {
  type: 'sqlite',
  database: '../../data/transactions.sqlite',
  entities: [AggregatedTransaction],
  synchronize: true, // Only for development
  logging: true,
};
