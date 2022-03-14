import { StoreEntity } from 'src/profiles/store/model/store.entity';
import { CustomerEntity } from 'src/profiles/customer/model/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { UserModule } from 'src/user/user.module';
import { StoreModule } from 'src/profiles/store/store.module';
import { CustomerModule } from 'src/profiles/customer/customer.module';
import { SessionSerializer } from './session.serializer';
import { UserEntity } from 'src/user/model/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CustomerEntity, StoreEntity]),
    PassportModule.register({ session: true }),
    UserModule,
    StoreModule,
    CustomerModule,
  ],
  providers: [SessionSerializer, LocalStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
