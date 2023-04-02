import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a user profile
   * @param id user id
   * @param userBio string for user biography
   * @returns Promise<Profile>
   */
  @Post('/:id/profile')
  async createUserProfile(
    @Param('id') id: string,
    @Body() userBio: { bio: string },
  ) {
    return this.usersService.createUserProfile(id, userBio.bio);
  }

  //   @Put('/:id/profile')
  //   async updateUserProfile(
  //     @Param('id') id: string,
  //     @Body() userBio: { bio: string },
  //   ) {
  //     return this.prismaService.profile.update({
  //       where: {
  //         userId: Number(id),
  //       },
  //       data: {
  //         bio: userBio.bio,
  //       },
  //     });
  //   }
}
