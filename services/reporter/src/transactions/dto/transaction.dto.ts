import { ApiProperty } from '@nestjs/swagger';

export class AggregatedTransactionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  earned: number;

  @ApiProperty()
  spent: number;

  @ApiProperty()
  payout: number;

  @ApiProperty()
  paidOut: number;
}