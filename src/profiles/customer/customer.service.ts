import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './model/customer.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepo: Repository<CustomerEntity>,
  ) {}

  async findProfileById(id: number): Promise<CustomerEntity> {
    const customer = await this.customerRepo.findOne(id);

    if (!customer) {
      throw new NotFoundException('Profile by ID not found [E22]');
    }

    return customer;
  }

  // Gerekli olmadikca bunun yerine
  // '/users/profile' tercih et (getProfileById)
  async getProfileWithUser(profileId: number): Promise<any> {
    const customer = await this.customerRepo.findOne({
      relations: ['user'],
      where: { id: profileId },
    });

    if (!customer) {
      throw new NotFoundException(
        'Customer with provided ID not found [cst:48]',
      );
    }

    const response = {
      ...customer,
      user: customer.user.toResponseObject(),
    };

    return response;
  }

  async update(
    id: number,
    data: Partial<CustomerEntity>,
  ): Promise<UpdateResult> {
    return await this.customerRepo.update(id, data);
  }
}
