import { UserUpdateDTO } from 'src/dtos/user.dto';
import { UserEntity } from './model/user.entity';
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return user.toResponseObject();
  }

  //
  async getProfileByUserId(id: number): Promise<UserEntity> {
    const user = await this.userRepo.findOne({
      relations: ['customer', 'store'],
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User by ID not found [usr:45]');
    }
    if (!user.active) {
      throw new UnauthorizedException('User is not active [usr:50]');
    }

    return user.toResponseObject();
  }

  async update(id: number, data: UserUpdateDTO): Promise<UpdateResult> {
    return await this.userRepo.update(id, data);
  }

}
