import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetCurrentUserId } from '@/auth/decorators';
import { IsOwner } from './guards/owner.guard';
import { CreateChatDto } from './dto/create-chat.dto';
import { AddMessageDto } from './dto/add-message.dto';
import { IsOn } from './guards/isOn.guard';
import { AddMessageListDto } from './dto/add-message-list.dto';
import { LoadMessagesDto } from './dto/load-messages.dto';
import { MessageCountDto } from './dto/messages-count.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/all')
  async getChats(@GetCurrentUserId() id: string) {
    return this.chatService.getChats(id);
  }

  @Delete('/message/:messageId/:userId')
  @UseGuards(IsOwner)
  async deleteMessage(@Param('messageId') messageId: string) {
    return this.chatService.deleteMessage(messageId);
  }

  @Post('/message')
  async addMessage(@Body() body: AddMessageDto) {
    return this.chatService.addMessage(body);
  }

  @Post('/messages')
  async addMessages(@Body() body: AddMessageListDto[]) {
    return this.chatService.addMessageList(body);
  }

  @Post()
  @UseGuards(IsOn)
  async createChat(@Body() body: CreateChatDto) {
    return this.chatService.createChat(body);
  }

  @Get('/following-to-chat')
  async followingToChat(@GetCurrentUserId() userId: string) {
    return this.chatService.followingToChat(userId);
  }

  @Post('/load')
  async loadMessages(@Body() body: LoadMessagesDto) {
    return this.chatService.loadMessages(body);
  }

  @SkipThrottle()
  @Get('/new-messages-count/:chatName')
  async getMessagesCount(
    @Param('chatName') chatName: string,
    @GetCurrentUserId() id: string,
  ) {
    return this.chatService.countNewMessages(chatName, id);
  }

  @SkipThrottle()
  @Put('/update-new-messages')
  async updateNewMessages(
    @Body() { chatName }: MessageCountDto,
    @GetCurrentUserId() id: string,
  ) {
    return this.chatService.updateNewMessages(chatName, id);
  }
}
