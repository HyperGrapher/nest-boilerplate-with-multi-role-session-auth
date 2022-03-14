import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { SessionEntity } from './auth/session.entity';
import { TypeormStore } from 'connect-typeorm';
import { getConnection } from 'typeorm';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import 'reflect-metadata'; // for type-orm

async function bootstrap() {
  const port = process.env.PORT || 9999;
  const app = await NestFactory.create(AppModule);
  const sessionRepository = getConnection().getRepository(SessionEntity);
  const maxAge = 60000 * 60 * 24 * 30; // 30days - 60000ms = 1 minute
  app.use(
    session({
      secret: process.env.PASSPORT_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: maxAge, secure: false }, // TODO: Enable 'secure' when using https
      store: new TypeormStore({
        // cleanupLimit: 2, // Doesn't work on MySQL
        ttl: maxAge, // time to live - 60000ms = 1 minute
        onError: () => Logger.log('Session Store Error', 'bootstrap'),
      }).connect(sessionRepository),
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:3000', // react
      'http://localhost:3001', // react
      /\.vercel\.app$/, // Vercel
    ],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'PATCH'],
    credentials: true,
  });
  


  // Api versioning with header
  // include a header called 'application' with a value of 1
  // in every call to the api
  // Asagida axios ornegi var
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'application', // !
  });

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
  Logger.log(`✅ Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();


/*
  const authAxios = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {
        application: "1",
        Accept: "application/json",
        withCredentials: true, // Required for session cookie to be set during login
        credentials: "include",
  },
});
*/
