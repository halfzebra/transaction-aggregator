import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { AggregatedTransaction } from '../../../shared/entities/aggregated-transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([AggregatedTransaction]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
