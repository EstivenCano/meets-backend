import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UsersModule } from '@/users/users.module';
import { PrismaService } from '@/prisma.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [UsersModule],
  providers: [ChatService, PrismaService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
