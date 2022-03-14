import { AuthService } from './auth.service';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/model/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  //* DON'T RENAME
  async validate(email: string, password: string): Promise<UserEntity> {
    const user = await this.authService.validateUserWithPassword(
      email,
      password,
    );

    return user;
  }
}
