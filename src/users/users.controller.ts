import { Body, Controller, Param, Post, Put, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Profile } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/:id/profile')
  async createUserProfile(@Param('id') id: string, @Body() profile: Profile) {
    return this.usersService.createUserProfile(id, profile);
  }

  @Put('/:id/profile')
  async updateUserProfile(@Param('id') id: string, @Body() profile: Profile) {
    return this.usersService.updateUserProfile(id, profile);
  }

  @Get('/:id/profile')
  async getUserProfile(@Param('id') id: string) {
    return this.usersService.getUserProfile(id);
  }

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/:id/drafts')
  async getDraftsByUser(@Param('id') id: string) {
    return this.usersService.getDraftsByUser(id);
  }

  @Get('/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }
}
