import { Body, Controller, Param, Post, Put, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/:id/profile')
  async createUserProfile(
    @Param('id') id: string,
    @Body() userBio: { bio: string },
  ) {
    return this.usersService.createUserProfile(id, userBio.bio);
  }

  @Put('/:id/profile')
  async updateUserProfile(
    @Param('id') id: string,
    @Body() userBio: { bio: string },
  ) {
    return this.usersService.updateUserProfile(id, userBio.bio);
  }

  @Get('/:id/profile')
  async getUserProfile(@Param('id') id: string) {
    return this.usersService.getUserProfile(id);
  }

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id/drafts')
  async getDraftsByUser(@Param('id') id: string) {
    return this.usersService.getDraftsByUser(id);
  }
}
