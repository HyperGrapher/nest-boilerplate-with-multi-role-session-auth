import { SimpleResponseDTO } from 'src/dtos/common.dto';
import { StoreEntity } from 'src/profiles/store/model/store.entity';
import { CustomerEntity } from 'src/profiles/customer/model/customer.entity';
import { UserEntity } from 'src/user/model/user.entity';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRegisterBody } from 'src/dtos/auth.dto';
import { UserRole } from 'src/dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,

    @InjectRepository(CustomerEntity)
    private customerRepo: Repository<CustomerEntity>,

    @InjectRepository(StoreEntity)
    private storeRepo: Repository<StoreEntity>,
  ) {}

  /**
   *
   * Validates user and password on Login attempt
   * login() Method is called below after this method runs
   *
   */

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { email } });
  }
  async getUserWithProfile(id: string | number): Promise<UserEntity> {
    const user = await this.userRepo.findOne({
      relations: ['customer', 'store'],
      where: { id },
    });
    return user.toResponseObject();
  }

  async validateUserWithPassword(
    email: string,
    pass: string,
  ): Promise<UserEntity> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found by ID [auth:39]');
    }

    const result = await user.comparePassword(pass);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async userLogin(user: UserEntity): Promise<UserEntity> {
    // If user entered wrong password, request reaches till here
    // Check if user validated and exists before moving on.
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!user.active) {
      throw new BadRequestException('User is not active');
    }

    return await this.getUserWithProfile(user.id); // returns with profile
  }

  async storeRegister(body: UserRegisterBody): Promise<SimpleResponseDTO> {
    const { fname, lname, email } = body;
    const userWithEmail = await this.findByEmail(email);

    if (userWithEmail) {
      throw new BadRequestException('Bu email kayıtlı, Lütfen giriş yapınız!');
    }

    // Create Entity objects without saving
    const storeEntity = this.storeRepo.create({ fname, lname });
    const userEntity = this.userRepo.create(body);

    try {
      // Save both profile and user in the same transaction.
      // Entity manager works with any given entity,
      // automatically find its repository and call its methods.
      await this.storeRepo.manager.transaction(async (entityManager) => {
        const store = await entityManager.save(storeEntity);
        userEntity.store = store;
        userEntity.profileId = store.id;
        userEntity.role = UserRole.STORE;
        await entityManager.save(userEntity);
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while creating user with store profile',
      );
    }

    return {
      success: true,
      message: 'User with store profile is created',
    };
  }

  async customerRegister(body: UserRegisterBody): Promise<SimpleResponseDTO> {
    const { fname, lname, email } = body;
    const userWithEmail = await this.findByEmail(email);

    if (userWithEmail) {
      throw new BadRequestException('Bu email kayıtlı, Lütfen giriş yapınız!');
    }

    // Create Entity objects without saving
    const customerEntity = this.customerRepo.create({ fname, lname });
    const userEntity = this.userRepo.create(body);

    try {
      // Save both profile and user in the same transaction.
      // Entity manager works with any given entity,
      // automatically find its repository and call its methods.
      await this.customerRepo.manager.transaction(async (entityManager) => {
        const customer = await entityManager.save(customerEntity);
        userEntity.customer = customer;
        userEntity.profileId = customer.id;
        userEntity.role = UserRole.CUSTOMER;
        await entityManager.save(userEntity);
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while creating user with customer profile',
      );
    }

    return {
      success: true,
      message: 'User with customer profile is created',
    };
  }
}
