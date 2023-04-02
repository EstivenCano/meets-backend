import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a user profile
   * @param id user id
   * @param bio string for user biography
   * @returns Promise<Profile>
   */
  async createUserProfile(id: string, bio: string) {
    return this.prisma.profile.create({
      data: {
        bio: bio,
        user: {
          connect: {
            id: Number(id),
          },
        },
      },
    });
  }
}
