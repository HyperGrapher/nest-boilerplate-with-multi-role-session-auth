/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserEntity } from 'src/user/model/user.entity';
import { CustomerEntity } from 'src/profiles/customer/model/customer.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreEntity } from './model/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, UpdateResult } from 'typeorm';
import { map } from 'lodash';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private storeRepo: Repository<StoreEntity>,
    @InjectRepository(CustomerEntity)
    private customerRepo: Repository<CustomerEntity>,
  ) {}

  // Gerekli olmadikca bunun yerine '/users/profile' tercih et (getProfileById)
  async getProfileWithUser(profileId: number): Promise<any> {
    const store = await this.storeRepo.findOne({
      relations: ['user'],
      where: { id: profileId },
    });

    if (!store) {
      throw new NotFoundException('Store with provided ID not found [cst:44]');
    }

    const response = {
      ...store,
      user: store.user.toResponseObject(),
    };

    return response;
  }

  async getFollowers(user: UserEntity): Promise<any[]> {
    const entityManager = getManager();
    const someQuery = await entityManager.query(
      `SELECT * FROM follow_store_jt WHERE userStoreId = ?;`,
      [user.profileId],
    );
    const customerIds = map(someQuery, 'userCustomeraId'); // [12, 14, 16, 18]

    // Projects gerekirse findByIds(customerIds, {relations: ["projects"] })
    const customerList = await this.customerRepo.findByIds(customerIds);

    return customerList;
  }

  async update(id: number, data: Partial<StoreEntity>): Promise<UpdateResult> {
    return await this.storeRepo.update(id, data);
  }
}
