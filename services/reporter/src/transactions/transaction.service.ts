import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregatedTransaction } from '../shared/entities/aggregated-transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(AggregatedTransaction)
    private readonly transactionsRepository: Repository<AggregatedTransaction>,
  ) {}

  async findByUserId(userId: string): Promise<AggregatedTransaction> {
    const transaction = await this.transactionsRepository.findOneBy({ userId });
    if (!transaction) {
      throw new NotFoundException(`Transaction for user ${userId} not found`);
    }
    return transaction;
  }

  async findAll(): Promise<AggregatedTransaction[]> {
    return this.transactionsRepository.find();
  }
}
