import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { MailModule } from '@/mail/mail.module';

@Module({
  imports: [UsersModule, MailModule, JwtModule.register({})],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
