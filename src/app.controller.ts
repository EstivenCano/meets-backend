import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

import { User as UserModel, Post as PostModel, Prisma } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}
}
