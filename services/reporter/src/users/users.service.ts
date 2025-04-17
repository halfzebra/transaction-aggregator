import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregatedTransaction } from '../shared/entities/aggregated-transaction.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(AggregatedTransaction)
    private readonly aggregatedTransactionRepository: Repository<AggregatedTransaction>,
  ) {}

  async getAllUsers() {
    const users = await this.aggregatedTransactionRepository.find({
      select: ['userId'],
    });
    return users.map(user => user.userId);
  }

  async getUserReport(uuid: string) {
    const report = await this.aggregatedTransactionRepository.findOne({
      where: { userId: uuid },
    });

    if (!report) {
      throw new NotFoundException(`User ${uuid} not found`);
    }

    return {
      userId: report.userId,
      earned: report.earned,
      spent: report.spent,
      paidOut: report.paidOut,
      availablePayout: report.payout,
      lastUpdated: report.lastAggregatedAt,
    };
  }
}