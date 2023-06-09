import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import * as argon from 'argon2';

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
        cover: profile.cover,
        user: {
          update: {
            name: profile.name,
          },
        },
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
    try {
      const profileData = this.prisma.profile.findUnique({
        where: {
          userId: Number(id),
        },
        select: {
          bio: true,
          picture: true,
          cover: true,
          user: {
            select: {
              name: true,
              _count: {
                select: {
                  posts: true,
                  followedBy: true,
                  following: true,
                },
              },
            },
          },
        },
      });

      if (!(await profileData.user()).id)
        throw new NotFoundException('User not found');

      return profileData;
    } catch (error) {
      throw new NotFoundException('Profile not found');
    }
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
   * Get user information
   * @param id user id
   * @returns Promise<User>
   */
  async getUserInfo(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        email: true,
        name: true,
        profile: {
          select: {
            picture: true,
          },
        },
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
        profile: {
          create: {
            bio: '',
            picture: '',
            cover: '',
          },
        },
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
            cover: '',
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

  /**
   * Update users reset token
   * @param id user id
   * @param token reset token
   * @returns
   */
  async updateResetToken(id: number, token: string) {
    return this.prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        resetToken: token,
      },
    });
  }

  /**
   * Update users password
   * @param id user id
   * @param password new password
   */
  async updatePassword(id: number, password: string) {
    return this.prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        password: password,
      },
    });
  }

  /**
   * Get users reset token
   * @param id user id
   * @returns Promise<User>
   */
  async getResetToken(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        resetToken: true,
      },
    });
  }

  //Return a boolean if user is following another user
  async isFollowingUser(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        following: {
          where: {
            id: Number(userId),
          },
        },
      },
    });

    return user.following.length > 0;
  }

  /**
   * Search users by name
   * @param search search string
   * @returns Promise<User[]>
   */
  async searchUsers(search: string) {
    return this.prisma.user.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        profile: {
          select: {
            picture: true,
          },
        },
      },
    });
  }

  /**
   * Delete a user and all relations
   * @param id user id
   * @param password user password
   * @returns
   */
  async deleteUser(id: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        password: true,
      },
    });

    try {
      const passwordMatches = await argon.verify(user.password, password);
      if (!passwordMatches) throw new ForbiddenException('Access Denied');
    } catch (error) {
      throw new ForbiddenException('Access Denied');
    }

    const deleteLikes = this.prisma.postLiked.deleteMany({
      where: {
        OR: {
          B: {
            equals: Number(id),
          },
        },
      },
    });

    const deleteFollows = this.prisma.userFollows.deleteMany({
      where: {
        OR: [
          {
            A: {
              equals: Number(id),
            },
          },
          {
            B: {
              equals: Number(id),
            },
          },
        ],
      },
    });

    const deleteUser = this.prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    return this.prisma.$transaction([deleteLikes, deleteFollows, deleteUser]);
  }

  /**
   * Get users followers
   * @param id user id
   * @returns Promise<User[]>
   */
  async getFollowers(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        followedBy: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                picture: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get users following
   * @param id user id
   * @returns Promise<User[]>
   */
  async getFollowing(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        following: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                picture: true,
              },
            },
          },
        },
      },
    });
  }
}
