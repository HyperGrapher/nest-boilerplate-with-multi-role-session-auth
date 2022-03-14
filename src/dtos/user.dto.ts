/* eslint-disable @typescript-eslint/no-unused-vars */
import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsMobilePhone,
  Length,
  IsEnum,
  IsEmail,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  STORE = 'store',
}

class UserUpdateDTOMaster {
  @IsMobilePhone('tr-TR')
  @ApiProperty() // Required for PartialType to work
  phone: string;

  @IsEmail()
  @ApiProperty()
  email: string;
}

export class UserUpdateDTO extends PartialType(UserUpdateDTOMaster) {}
