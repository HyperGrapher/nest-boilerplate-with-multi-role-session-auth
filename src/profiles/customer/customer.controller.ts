import { CustomerGuard } from 'src/auth/roles.guard';
import { CustomerService } from './customer.service';
import { CustomerEntity } from './model/customer.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe as ValidationNativePipe,
  BadRequestException,
} from '@nestjs/common';
import { User } from 'src/user/user.decorator';
import { SessionAuthGuard } from 'src/auth/session.guard';
import { UserEntity } from 'src/user/model/user.entity';
import { SimpleResponseDTO } from 'src/dtos/common.dto';

@Controller({ path: 'customers', version: '1' })
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get()
  @UseGuards(SessionAuthGuard)
  async returnRequestUserTest(@User() user: UserEntity): Promise<any> {
    return user;
  }

  @Get('get/:id')
  @UseGuards(SessionAuthGuard)
  async findById(@Param('id') id: number): Promise<CustomerEntity> {
    return this.customerService.findProfileById(id);
  }

  @Get('profile')
  @UseGuards(SessionAuthGuard)
  async getProfileWithUser(@User() user: UserEntity): Promise<CustomerEntity> {
    return this.customerService.getProfileWithUser(user.profileId);
  }

  @Patch()
  @UseGuards(SessionAuthGuard, CustomerGuard)
  @UsePipes(new ValidationNativePipe())
  async updateUser(
    @User() user: UserEntity,
    @Body() data: Partial<CustomerEntity>,
  ): Promise<SimpleResponseDTO> {
    const result = await this.customerService.update(user.profileId, data);

    if (!result.affected) throw new BadRequestException('Update failed');

    return {
      success: true,
      message: 'User entity updated',
    };
  }
}
