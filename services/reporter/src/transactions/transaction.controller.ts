import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { AggregatedTransactionDto } from './dto/transaction.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all aggregated transactions' })
  @ApiResponse({
    status: 200,
    description: 'List of all aggregated transactions',
    type: [AggregatedTransactionDto],
  })
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get aggregated transactions for specific user' })
  @ApiResponse({
    status: 200,
    description: "User's aggregated transactions",
    type: AggregatedTransactionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  findByUserId(@Param('userId') userId: string) {
    return this.transactionService.findByUserId(userId);
  }
}
