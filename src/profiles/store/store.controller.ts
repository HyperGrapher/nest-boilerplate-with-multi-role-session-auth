/* eslint-disable @typescript-eslint/no-unused-vars */
import { StoreGuard } from 'src/auth/roles.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe as ValidationNativePipe,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreEntity } from './model/store.entity';
import { User } from 'src/user/user.decorator';
import { SessionAuthGuard } from 'src/auth/session.guard';
import { UserEntity } from 'src/user/model/user.entity';
import { SimpleResponseDTO } from 'src/dtos/common.dto';

@Controller({ path: 'stores', version: '1' })
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Get('/followers')
  @UseGuards(SessionAuthGuard, StoreGuard)
  followStore(@User() user: UserEntity): Promise<any[]> {
    return this.storeService.getFollowers(user);
  }

  @Get('profile')
  @UseGuards(SessionAuthGuard)
  async getProfileWithUser(@User() user: UserEntity): Promise<any> {
    return this.storeService.getProfileWithUser(user.profileId);
  }

  @Patch()
  @UseGuards(SessionAuthGuard, StoreGuard)
  @UsePipes(new ValidationNativePipe())
  async updateUser(
    @User() user: UserEntity,
    @Body() data: Partial<StoreEntity>,
  ): Promise<SimpleResponseDTO> {
    const result = await this.storeService.update(user.profileId, data);

    if (!result.affected) throw new BadRequestException('Update failed');

    return {
      success: true,
      message: 'User entity updated',
    };
  }
}
