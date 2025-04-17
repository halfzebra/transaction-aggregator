import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
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
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
