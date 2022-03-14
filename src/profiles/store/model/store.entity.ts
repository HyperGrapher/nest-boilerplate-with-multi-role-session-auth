/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { IsEmail, IsMobilePhone, IsString, Length } from 'class-validator';
import { Exclude } from 'class-transformer';
import { IsAlphanumeric } from 'class-validator';
import { SharedProfileEntity } from 'src/shared/profile.entity';
import { UserEntity } from 'src/user/model/user.entity';

@Entity({ name: 'user_store' })
export class StoreEntity extends SharedProfileEntity {
  toResponseObject(): any {
    const { id, fname, lname } = this;
    return { id, fname, lname };
  }

  @OneToOne(() => UserEntity, (user) => user.store)
  user: UserEntity;
}
