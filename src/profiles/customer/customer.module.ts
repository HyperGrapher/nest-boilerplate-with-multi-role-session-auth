import { CustomerEntity } from './model/customer.entity';
import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from 'src/profiles/store/model/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity, StoreEntity])],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
