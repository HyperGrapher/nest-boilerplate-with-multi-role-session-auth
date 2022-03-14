import { SessionAuthGuard } from 'src/auth/session.guard';
import { UserService } from './user.service';
import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UsePipes,
  UseGuards,
  ValidationPipe as ValidationNativePipe,
  BadRequestException,
} from '@nestjs/common';
import { UserEntity } from './model/user.entity';
import { User } from 'src/user/user.decorator';
import { UserUpdateDTO } from 'src/dtos/user.dto';
import { SimpleResponseDTO } from 'src/dtos/common.dto';

@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(SessionAuthGuard)
  @Get('get/:id')
  async getUserWithId(@Param('id') id: string): Promise<UserEntity> {
    return await this.userService.findById(id);
  }

  @Get('profile')
  @UseGuards(SessionAuthGuard)
  getUserByIdWithProfile(@User() user: UserEntity): Promise<UserEntity> {
    return this.userService.getProfileByUserId(user.id);
  }

  /**
   * Gelen request'teki user icin update yapar
   * @User() decorator ile request'den user getirilir
   */
  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationNativePipe())
  @Patch()
  async updateUser(
    @User() user: UserEntity,
    @Body() data: UserUpdateDTO,
  ): Promise<SimpleResponseDTO> {
    const result = await this.userService.update(user.id, data);

    if (!result.affected) throw new BadRequestException('Update failed');

    return { success: true, message: 'User entity updated' };
  }
}
