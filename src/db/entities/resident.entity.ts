import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { City } from './city.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('residents')
export class Resident {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column()
  // index added for make binary tree and reducing the number of comparisons needed during searches by first_name row
  @Index()
  first_name: string;

  @ApiProperty()
  @Column()
  // index added for make binary tree and reducing the number of comparisons needed during searches by last_name row
  @Index()
  last_name: string;

  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city: City;
}
