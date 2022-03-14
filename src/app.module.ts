import { ConfigModule } from '@nestjs/config';
import { LoggingInterceptor } from './utilities/logging.interceptor';
import { HttpErrorFilter } from './utilities/http-error.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './profiles/admin/admin.module';


/*

.env okunabilmesi icin oncelikle ENVIRONMENT set edilmeli

Powershell script'i ile halledilebilir:
```
function dev { 
  $env:ENVIRONMENT = "development"
  & npm run start:dev
}

function test { 
  $env:ENVIRONMENT = "testing"
  & npm run test:e2e
}
```
*/


Logger.log(`ENVIRONMENT is: ${process.env.ENVIRONMENT}`, 'app.module');

let envFilePath = undefined;

switch (process.env.ENVIRONMENT) {
  case 'DEVELOPMENT':
    envFilePath = '.env.development';
    break;

  case 'TESTING':
    envFilePath = '.env.test';
    break;

  case 'PRODUCTION':
    envFilePath = '.env.production';
    break;

  default:
    break;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_DB_HOST,
      port: Number.parseInt(process.env.MYSQL_DB_PORT),
      username: process.env.MYSQL_DB_USER,
      password: process.env.MYSQL_DB_PASS,
      database: process.env.MYSQL_DB_NAME,
      logging: false,
      synchronize: true,
      entities: ['./dist/**/*.entity.js'],
    }),
    UserModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Provides consistently structured error messages for the app
    { provide: APP_FILTER, useClass: HttpErrorFilter },
    // Provides general request logging.
    // You can use controller specific logging by removing this
    // and adding @UseInterceptors(new LoggingInterceptor())
    // decorator to specific controllers and
    // only those controllers will be logging
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
