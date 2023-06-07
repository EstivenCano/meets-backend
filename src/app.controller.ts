import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { Public } from './auth/decorators';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Throttle(10, 60)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('check-running')
  isRunning(@Res() res: Response) {
    console.log('Healthy checked');
    res.status(200).send('Running!');
  }
}
