import { UserRole } from './user.dto';
import { IsString, IsEmail, Length, IsNotEmpty } from 'class-validator';

export interface RequestUser {
  id: number;
  created: string;
  updated: string;
  email: string;
  profileId: number;
  phone: string | null;
  role: UserRole;
}

export class UserLoginBody {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 128)
  password: string;
}

export class UserRegisterBody {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 32)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  fname: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  lname: string;
}
