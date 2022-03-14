/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomerEntity } from 'src/profiles/customer/model/customer.entity';
import { StoreEntity } from 'src/profiles/store/model/store.entity';
import {
  Entity,
  Column,
  BeforeInsert,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import {
  IsString,
  IsBoolean,
  IsArray,
  IsEmail,
  IsMobilePhone,
  IsInt,
  Length,
  IsAlphanumeric,
  IsEnum,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { SharedEntity } from 'src/shared/shared.entity';
import { UserRole } from 'src/dtos/user.dto';

@Entity({ name: 'user_base' })
export class UserEntity extends SharedEntity {
  @BeforeInsert()
  async hashPassword(): Promise<any> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(): any {
    const { id, email, role, profileId, customer, store } = this;

    return { id, email, role, profileId, customer, store };
  }

  @Column('varchar', { length: 128, unique: true })
  @IsEmail()
  email: string;

  @Column('varchar', { length: 128 })
  @IsString()
  @Length(6, 32)
  @Exclude()
  password: string;

  @Column('int', { nullable: false })
  @IsNumber()
  profileId: number;

  @Column('varchar', { nullable: true })
  @IsMobilePhone(['tr-TR'])
  phone: string; // "90553xxxxxxx" basinda 90 bulunmali

  @Column('boolean', { default: true })
  @IsBoolean()
  active: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STORE,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @OneToOne((type) => StoreEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store' })
  store: StoreEntity;

  @OneToOne((type) => CustomerEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer' })
  customer: CustomerEntity;
}
