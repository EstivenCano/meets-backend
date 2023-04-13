import { Body, Controller, Param, Post, Put, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { GetCurrentUserId } from '../auth/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/:id/profile')
  async createUserProfile(
    @Param('id') id: string,
    @Body() profile: CreateProfileDto,
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
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Post('/:id/follow')
  async followUser(
    @GetCurrentUserId() id: string,
    @Param('id') userId: string,
  ) {
    return this.usersService.followUser(id, userId);
  }

  @Post('/:id/unfollow')
  async unfollowUser(
    @GetCurrentUserId() id: string,
    @Param('id') userId: string,
  ) {
    return this.usersService.unfollowUser(id, userId);
  }
}
