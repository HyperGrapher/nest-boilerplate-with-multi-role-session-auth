import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Column,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

/**
 * Shared by Profile entitites
 */
export abstract class SharedProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 25 })
  @IsString()
  fname: string;

  @Column('varchar', { length: 25 })
  @IsString()
  lname: string;

  @Column('json', { nullable: true })
  @IsString()
  address: object;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  @Exclude()
  updated: Date;
}
