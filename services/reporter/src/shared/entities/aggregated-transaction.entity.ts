import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AggregatedTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ type: 'float' })
  earned: number;

  @Column({ type: 'float' })
  spent: number;

  @Column({ type: 'float' })
  payout: number;

  @Column({ type: 'float' })
  paidOut: number;
}
