import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { AddMessageDto } from './dto/add-message.dto';

@WebSocketGateway(8001, {
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('event_join')
  handleJoinRoom(client: Socket, room: string) {
    client.join(`${room}`);
  }

  @SubscribeMessage('event_message')
  handleIncommingMessage(client: Socket, payload: AddMessageDto) {
    this.server.to(payload.chatName).emit('new_message', payload);
    this.chatService.addMessage(payload);
  }

  @SubscribeMessage('event_leave')
  handleRoomLeave(client: Socket, room: string) {
    console.log('Leaves');
    client.leave(`${room}`);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
