import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetFeedDto } from './dto/get-feed.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a draft post
   * @param postData  { title: string; content?: string; authorEmail: string }
   * @returns Promise<Post>
   */
  async createDraft(postData: CreatePostDto) {
    const { title, content, authorEmail, publish } = postData;

    const user = await this.prisma.user.findUnique({
      where: { email: authorEmail },
    });

    if (!user) {
      throw new NotFoundException(`Author with email ${authorEmail} not found`);
    }

    return this.prisma.post.create({
      data: {
        title,
        content,
        published: publish,
        author: {
          connect: { email: authorEmail },
        },
      },
    });
  }

  /**
   * Get a post by id
   * @param id post id
   * @returns Promise<Post>
   */
  async getPostById(id: string) {
    return this.prisma.post.findUnique({ where: { id: Number(id) } });
  }

  /**
   * Toggle publish post
   * @param id post id
   * @returns Promise<Post>
   */
  async togglePublishPost(id: string) {
    const postData = await this.prisma.post.findUnique({
      where: { id: Number(id) },
      select: {
        published: true,
      },
    });

    return this.prisma.post.update({
      where: { id: Number(id) || undefined },
      data: { published: !postData?.published },
    });
  }

  /**
   * Delete a post
   * @param id post id
   * @returns Promise<Post>
   */
  async deletePost(id: string) {
    return this.prisma.post.delete({ where: { id: Number(id) } });
  }

  /**
   * Increment post view count
   * @param id post id
   * @returns Promise<Post>
   */
  async incrementPostViewCount(id: string) {
    return this.prisma.post.update({
      where: { id: Number(id) },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Add comment to post
   * @param commentData { content: string; authorEmail: string }
   * @param id post id
   * @returns Promise<Comment>
   */
  async addCommentToPost(
    id: string,
    commentData: { content: string; authorEmail: string },
  ) {
    const { content, authorEmail } = commentData;

    return this.prisma.comment.create({
      data: {
        content,
        author: {
          connect: { email: authorEmail },
        },
        post: {
          connect: { id: Number(id) },
        },
      },
    });
  }

  /**
   * Get comments for post
   * @param id post id
   * @returns Promise<Comment[]>
   */
  async getCommentsForPost(id: string) {
    return this.prisma.comment.findMany({
      where: {
        postId: Number(id),
      },
      include: {
        author: {
          select: {
            name: true,
            id: true,
            profile: {
              select: {
                picture: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update comment
   * @param commentId comment id
   * @param content comment content
   * @returns Promise<Comment>
   */
  async updateComment(commentId: string, content: string) {
    return this.prisma.comment.update({
      where: {
        id: Number(commentId),
      },
      data: {
        content,
      },
    });
  }

  /**
   * Get likes for post
   * @param postId
   * @returns Promise<Post>
   */
  async getLikesForPost(postId: string) {
    return this.prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
      select: {
        likedBy: {
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
   * Like post
   * @param postId post id
   * @param userId user id
   * @returns Promise<Post>
   */
  async likePost(postId: string, userId: string) {
    return this.prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        likedBy: {
          connect: {
            id: Number(userId),
          },
        },
      },
    });
  }

  /**
   * Unlike post
   * @param postId post id
   * @param userId user id
   * @returns Promise<Post>
   */
  async unlikePost(postId: string, userId: string) {
    return this.prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        likedBy: {
          disconnect: {
            id: Number(userId),
          },
        },
      },
    });
  }

  /**
   * Get all posts from followed users with pagination
   * @returns Promise<Post[]>
   */
  async getFeedPosts(filterData: GetFeedDto & { userId: string }) {
    const { searchString, page, perPage, userId, byAuthor } = filterData;

    if (!userId) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const include = {
      author: {
        select: {
          name: true,
          id: true,
          profile: {
            select: {
              picture: true,
            },
          },
        },
      },
      likedBy: {
        where: {
          id: Number(userId),
        },
        select: {
          id: true,
        },
        take: 1,
      },
      _count: {
        select: {
          likedBy: true,
          comments: true,
        },
      },
    };

    const or = searchString
      ? {
          OR: [
            { title: { contains: searchString } },
            { content: { contains: searchString } },
          ],
        }
      : {};

    if (byAuthor) {
      return await this.prisma.post.findMany({
        where: {
          published: true,
          authorId: {
            equals: Number(byAuthor),
          },
          ...or,
        },
        include,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    const following = await this.prisma.user
      .findUnique({
        where: {
          id: Number(userId),
        },
      })
      .following();

    const followingIds = [...following.map((user) => user.id), Number(userId)];

    return this.prisma.post.findMany({
      where: {
        published: true,
        authorId: {
          in: followingIds,
        },
        ...or,
      },
      include,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
