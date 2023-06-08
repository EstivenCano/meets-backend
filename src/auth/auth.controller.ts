import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { GetCurrentUser, GetCurrentUserId } from './decorators';
import { RtGuard } from './guards';
import {
  SigninDto,
  SignupDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
} from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle(10, 60)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('check-running')
  isRunning(@Res() res: Response) {
    res.status(200).send('Running!');
  }

  @Throttle(10, 60)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: SigninDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Throttle(5, 60)
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() signUpDto: SignupDto) {
    return this.authService.singUp(
      signUpDto.email,
      signUpDto.password,
      signUpDto.name,
    );
  }

  @Throttle(2, 10)
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  @Get('refresh')
  refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Public()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const tokens = await this.authService.googleAuth(req);

    const url = new URL(process.env.FRONTEND_URL);

    url.searchParams.set('access', tokens.access_token);
    url.searchParams.set('refresh', tokens.refresh_token);

    res.redirect(url.toString());

    return {
      message: 'User information from google',
      tokens,
    };
  }

  @Public()
  @Post('request-reset-password')
  @HttpCode(HttpStatus.OK)
  async requestResetPassword(@Body() body: RequestPasswordResetDto) {
    const { email } = body;
    return this.authService.requestPasswordReset(email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { password, token, userId } = body;
    return this.authService.resetPassword(userId, token, password);
  }

  @Public()
  @Get('verify-reset-token/:token/:userId')
  @HttpCode(HttpStatus.OK)
  async verifyResetToken(
    @Param('token') token: string,
    @Param('userId') userId: string,
  ) {
    return this.authService.verifyResetToken(userId, token);
  }
}
