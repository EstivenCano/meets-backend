import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a draft post
   * @param postData  { title: string; content?: string; authorEmail: string }
   * @returns Promise<Post>
   */
  async createDraft(
    @Body() postData: { title: string; content?: string; authorEmail: string },
  ) {
    const { title, content, authorEmail } = postData;

    return this.prisma.post.create({
      data: {
        title,
        content,
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
}
