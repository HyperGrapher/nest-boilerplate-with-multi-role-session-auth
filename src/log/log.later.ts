/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { classToPlain } from 'class-transformer';
// import { UserEntity } from '../user/model/user.entity';

@Entity({ name: 'logs' })
export class LogEntity {
  toJSON(): any {
    return classToPlain(this);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 50,
    nullable: true,
    comment: 'Logged in visiter email',
  })
  email: string;
  /* 
	@ManyToOne(
		(type) => UserEntity,
		(user) => user.projects,
		{ nullable: true },
	) */
  visiter: string;

  @Column('varchar', { length: 50 })
  path: string;

  @Column('varchar', { length: 20 })
  role: string;

  @Column({ nullable: true, comment: 'User id whom profile is visited' })
  profile: number;

  @CreateDateColumn()
  created: Date;
}
