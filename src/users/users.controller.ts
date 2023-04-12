import { Body, Controller, Param, Post, Put, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetUserDto } from './dto/get-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/:id/profile')
  async createUserProfile(
    @Param('id') id: string,
    @Body() profile: UpdateProfileDto,
  ) {
    return this.usersService.createUserProfile(id, profile);
  }

  @Put('/:id/profile')
  async updateUserProfile(
    @Param('id') id: string,
    @Body() profile: UpdateProfileDto,
  ) {
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
  async getUserByEmail(@Param('email') user: GetUserDto) {
    return this.usersService.getUserByEmail(user.email);
  }
}
