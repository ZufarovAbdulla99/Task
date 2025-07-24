import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { CourseModule } from './modules/course/course.module';
import { TaskModule } from './modules/task/task.module';
import { AuthModule } from './modules/auth/auth.module';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { CheckRoleGuard } from './guards/check-role.guard';
import { JwtModule } from '@nestjs/jwt';
import { SeedModule } from './modules/seeds/seeds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      global: true,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '24h',
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    CourseModule,
    TaskModule,
    SeedModule
  ],
  providers: [
    {
      useClass: CheckAuthGuard,
      provide: APP_GUARD
    },
    {
      useClass: CheckRoleGuard,
      provide: APP_GUARD
    },
  ],
})
export class AppModule {}

