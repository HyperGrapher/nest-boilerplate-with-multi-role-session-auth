/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  Column,
  BeforeInsert,
  OneToMany,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsIBAN,
  IsArray,
  IsEmail,
  IsMobilePhone,
  IsInt,
  Length,
  IsAlphanumeric,
  IsEnum,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { SharedProfileEntity } from 'src/shared/profile.entity';
import { UserEntity } from 'src/user/model/user.entity';

@Entity({ name: 'user_customer' })
export class CustomerEntity extends SharedProfileEntity {
  toResponseObject(): any {
    const { id, fname, lname, user, address } = this;
    return { id, fname, lname, user, address };
  }

  @OneToOne(() => UserEntity, (user) => user.customer)
  user: UserEntity;
}
