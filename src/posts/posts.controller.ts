import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CommentPostDto } from './dto/comment-post.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCurrentUserId } from '../auth/decorators';
import { GetFeedDto } from './dto/get-feed.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/feed')
  async getFeedPosts(
    @Body() filterData: GetFeedDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.postsService.getFeedPosts({ ...filterData, userId });
  }

  @Post()
  async createDraft(@Body() postData: CreatePostDto) {
    return this.postsService.createDraft(postData);
  }

  @Get('/:id')
  async getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Put('/publish/:id')
  async togglePublishPost(@Param('id') id: string) {
    return this.postsService.togglePublishPost(id);
  }

  @Delete('/:id')
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }

  @Put('/:id/views')
  async incrementPostViewCount(@Param('id') id: string) {
    return this.postsService.incrementPostViewCount(id);
  }

  @Post('/:id/comments')
  async addCommentToPost(
    @Param('id') id: string,
    @Body() commentData: CommentPostDto,
  ) {
    const { content, authorEmail } = commentData;
    return this.postsService.addCommentToPost(id, { content, authorEmail });
  }

  @Get('/:id/comments')
  async getCommentsForPost(@Param('id') id: string) {
    return this.postsService.getCommentsForPost(id);
  }

  @Put('/:id/comments/:commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() commentData: UpdateCommentDto,
  ) {
    const { content } = commentData;
    return this.postsService.updateComment(commentId, content);
  }

  @Post('/:id/like')
  async likePost(
    @Param('id') postId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.postsService.likePost(postId, userId);
  }

  @Post('/:id/unlike')
  async unlikePost(
    @Param('id') postId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.postsService.unlikePost(postId, userId);
  }
}
