import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { scrypt as _scrypt } from 'crypto';
import { JwtPayload } from './types';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async singUp(email: string, password: string, name?: string) {
    //See if email is in use
    const userExist = await this.usersService.getUserByEmail(email);

    if (userExist) {
      throw new BadRequestException('Email in use');
    }

    const hash = await argon.hash(password);

    const user = await this.usersService.createUser(email, hash, name);

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatches = await argon.verify(user.password, password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.usersService.getUserById(String(userId));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.hashedRefreshToken) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashedRefreshToken, refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number) {
    await this.usersService.updateUserRefreshToken(String(userId), null);
    return true;
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await argon.hash(refreshToken);
    await this.usersService.updateUserRefreshToken(String(userId), hash);
  }

  async getTokens(userId: number, email: string) {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
