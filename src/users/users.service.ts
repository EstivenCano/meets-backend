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

  /**
   * Update a user profile
   * @param id user id
   * @param bio string for user biography
   * @returns Promise<Profile>
   */
  async updateUserProfile(id: string, bio: string) {
    return this.prisma.profile.update({
      where: {
        userId: Number(id),
      },
      data: {
        bio: bio,
      },
    });
  }

  /**
   * Get a user profile
   * @param id user id
   * @returns Promise<Profile>
   */
  async getUserProfile(id: string) {
    return this.prisma.profile.findUnique({
      where: {
        userId: Number(id),
      },
    });
  }

  /**
   * Get all users
   * @returns Promise<User[]>
   */
  async getAllUsers() {
    return this.prisma.user.findMany();
  }
}
