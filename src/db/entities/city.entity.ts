import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column()
  // index added for make binary tree and reducing the number of comparisons needed during searches by name row
  @Index()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;
}
