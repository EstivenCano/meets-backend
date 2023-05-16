import { PrismaService } from '@/prisma.service';
import { UsersService } from '@/users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { AddMessageDto } from './dto/add-message.dto';
import { AddMessageListDto } from './dto/add-message-list.dto';

@Injectable()
export class ChatService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  /**
   * Return all chats from an specific user
   * @param userId Id for the user
   * returns Promise<Chat[]>
   */
  async getChats(userId: string) {
    return this.prisma.chat.findMany({
      where: {
        participants: {
          some: {
            id: Number(userId),
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 15,
        },
        _count: {
          select: {
            messages: true,
          },
        },
        participants: {
          where: {
            NOT: {
              id: Number(userId),
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
        },
      },
    });
  }

  /**
   * Create a new chat an connect users to it
   * @param createChat chat name and user's id
   * @returns Promise<Chat>
   */
  async createChat(createChat: CreateChatDto) {
    const users = createChat.userIds.map((id) => ({ id: id }));

    const chatsFinded = await this.prisma.chat.findMany({
      where: {
        name: createChat.name,
      },
    });

    if (chatsFinded.length > 0) {
      throw new BadRequestException('Chat already exist');
    }

    return this.prisma.chat.create({
      data: {
        name: createChat.name,
        participants: {
          connect: users,
        },
      },
    });
  }

  /**
   * Create a new message and updat the latest change on the chat
   * @param addMessage content, user id, chat name and createdAt
   * @returns Promise<Message>
   */
  async addMessage(addMessage: AddMessageDto) {
    const { chatName, content, authorId, createdAt } = addMessage;

    await this.prisma.chat.update({
      where: {
        name: chatName,
      },
      data: {
        updatedAt: createdAt,
      },
    });

    return this.prisma.message.create({
      data: {
        content,
        author: {
          connect: { id: authorId },
        },
        chat: {
          connect: { name: chatName },
        },
      },
    });
  }

  /**
   * Add a list of messages
   * @param addMessageList content, user id, and chat name
   * @returns Promise<Message>
   */
  async addMessageList(messageList: AddMessageListDto[]) {
    const messages = messageList.map(({ chatId, content, authorId }) => ({
      content,
      authorId,
      chatId,
    }));

    return this.prisma.message.createMany({
      data: messages,
    });
  }

  /**
   * Delete message that match with given id
   * @param messageId message to delete
   * @returns
   */
  deleteMessage = (messageId: string) => {
    return this.prisma.message.delete({
      where: {
        id: Number(messageId),
      },
    });
  };

  /**
   * Return following users that does not have a chat with current user
   * @param userId current user id
   * @returns Promise<UserInfo[]>
   */
  async followingToChat(userId: string) {
    const following = (await this.usersService.getFollowing(userId)).following;

    const participants = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: {
            id: Number(userId),
          },
        },
      },
      select: {
        participants: {
          select: {
            id: true,
          },
        },
      },
    });

    const participantIds = participants.flatMap(({ participants }) =>
      participants.map((p) => p.id),
    );

    return following.flatMap((f) => (!participantIds.includes(f.id) ? f : []));
  }
}
