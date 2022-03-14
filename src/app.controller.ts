/* eslint-disable @typescript-eslint/no-unused-vars */
import { SimpleResponseDTO } from 'src/dtos/common.dto';
import { UserEntity } from './user/model/user.entity';
import { ValidationPipe } from 'src/utilities/validation.pipe';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  Request,
  Session,
  Res,
  Header,
  Version,
} from '@nestjs/common';
import { SessionLocalAuthGuard } from './auth/sessiom-local-auth.guard';
import { AuthService } from './auth/auth.service';
import { SessionAuthGuard } from './auth/session.guard';
import { UserRegisterBody } from './dtos/auth.dto';

//*-> With LocalAuthGuard The route handler will only be
//*-> invoked if the user has been validated

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Version('1')
  @UseGuards(SessionAuthGuard)
  @Header('Access-Control-Allow-Credentials', 'true')
  @Header('Access-Control-Allow-Origin', '*')
  @Header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  @Get('auth/user-info')
  userInfo(
    @Request() request: any,
    @Session() session: Record<string, any>,
  ): any {
    return session;
  }

  /**
   *
   * @param req
   * @param session
   * @param res
   * @returns UserEntity with profile
   *
   * Store ve Customer ortak girisi
   */
  @Version('1')
  @UseGuards(SessionLocalAuthGuard)
  @Post('auth/login')
  @Header('Access-Control-Allow-Credentials', 'true')
  async userLogin(
    @Request() req,
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) res,
  ): Promise<UserEntity> {
    
    res.cookie(
      'user',
      {
        id: session.passport.user.id,
        email: session.passport.user.email,
        role: session.passport.user.role,
        profileId: session.passport.user.profileId,
        session_cookie: session.cookie,
      },
      { httpOnly: true },
    );

    return this.authService.userLogin(req.user);
  }

  @Version('1')
  @Post('auth/customer/register')
  @UsePipes(new ValidationPipe())
  async customerSessionRegister(
    @Body() data: UserRegisterBody,
    @Res({ passthrough: true }) res,
  ): Promise<SimpleResponseDTO> {
    return this.authService.customerRegister(data);
  }

  @Post('auth/store/register')
  @UsePipes(new ValidationPipe())
  async storeSessionRegister(@Body() data: UserRegisterBody): Promise<any> {
    return this.authService.storeRegister(data);
  }

  @Version('1')
  @UseGuards(SessionAuthGuard)
  @Get('auth/test-session-protected')
  testSessionProtected(
    @Request() request: any,
    @Session() session: Record<string, any>,
  ): any {
    session.visits = session.visits ? session.visits + 1 : 1;

    return session;
  }

  @Version('1')
  @UseGuards(SessionAuthGuard)
  @Get('auth/csrf-token')
  csrf(@Request() request: any, @Session() session: Record<string, any>): any {
    return { csrfToken: 'CSRF_1234567' };
  }
}
