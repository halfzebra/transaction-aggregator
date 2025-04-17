import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { AggregatedTransaction } from '../../../../shared/entities/aggregated-transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(AggregatedTransaction)
    private transactionsRepository: Repository<AggregatedTransaction>,
  ) {}

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
