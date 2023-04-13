import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a user profile
   * @param id user id
   * @param Profile object
   * @returns Promise<Profile>
   */
  async createUserProfile(id: string, profile: CreateProfileDto) {
    return this.prisma.profile.create({
      data: {
        bio: profile.bio,
        picture: profile.picture,
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
   * @param profile Profile object
   * @returns Promise<Profile>
   */
  async updateUserProfile(id: string, profile: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: {
        userId: Number(id),
      },
      data: {
        bio: profile.bio,
        picture: profile.picture,
      },
    });
  }

  /**
   * Create a new user
   * @param id user id
   * @param refreshToken hashed refresh token
   * @returns Promise<User>
   */
  async updateUserRefreshToken(id: string, refreshToken?: string) {
    return this.prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        hashedRefreshToken: refreshToken,
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

  /**
   * Get all drafts by user
   * @param id user id
   * @returns Promise<Post[]>
   */
  async getDraftsByUser(id: string) {
    return this.prisma.user
      .findUnique({
        where: { id: Number(id) },
      })
      .posts({
        where: {
          published: false,
        },
      });
  }

  /**
   * Get only one user by given email
   * @param email user email
   * @returns Promise<User>
   */
  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  /**
   * Get only one user by given id
   * @param id user id
   * @returns Promise<User>
   */
  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  /**
   * Create a new user
   * @param email user email
   * @param password user password
   * @param name user name
   * @returns Promise<User>
   */
  async createUser(email: string, password: string, name?: string) {
    return this.prisma.user.create({
      data: {
        email: email,
        password: password,
        name: name,
      },
    });
  }

  /**
   * Create a new user with profile
   * @param email user email
   * @param password user password
   * @param name user name
   * @param profile user profile
   * @returns Promise<User>
   */
  async createUserWithProfile(
    email: string,
    password: string,
    name: string,
    profile: CreateProfileDto,
  ) {
    return this.prisma.user.create({
      data: {
        email: email,
        password: password,
        name: name,
        profile: {
          create: {
            bio: profile.bio,
            picture: profile.picture,
          },
        },
      },
    });
  }

  /**
   * Update users followers
   * @param id user id
   * @param userId user id to follow
   * @returns Promise<User>
   */
  async followUser(id: string, userId: string) {
    return this.prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        following: {
          connect: {
            id: Number(userId),
          },
        },
      },
    });
  }

  /**
   * Update users followers
   * @param id user id
   * @param userId user id to unfollow
   * @returns Promise<User>
   */
  async unfollowUser(id: string, userId: string) {
    return this.prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        following: {
          disconnect: {
            id: Number(userId),
          },
        },
      },
    });
  }
}
