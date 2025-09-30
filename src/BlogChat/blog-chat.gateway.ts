import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { BlogChatService } from './blog-chat.service';
import { ConfigService } from '@nestjs/config';
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
@Injectable()
export class BlogChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(BlogChatGateway.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly blogChatService: BlogChatService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.query.token as string;
      if (!token) {
        socket.disconnect();
        throw new WsException('Unauthorized');
      }

      const secret = this.config.get<string>('JWT_SECRET') || 'secretKey';
      const payload = this.jwtService.verify(token, { secret });

      socket.data.user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name || 'Unknown User',
      };
      this.logger.log(`user connected : ${payload.sub} (socket: ${socket.id})`);
      socket.join(`user: ${payload.sub}`);
    } catch (error) {
      this.logger.log(`Connection error: ${error.message}`);
      socket.disconnect();
      throw new WsException(' Invalid token');
    }
  }

  async handleDisconnect(socket: Socket) {
    const user = socket.data.user;
    if (user) {
      this.logger.log(`user disconnected : ${user.id} (socket: ${socket.id})`);
      socket.leave(`user: ${user.id}`);
    } else {
      this.logger.log(`Socket disconnected: ${socket.id}`);
    }
  }

  @SubscribeMessage('joinBlogChat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { blogId: number },
  ) {
    const room = `blog_${data.blogId}`;
    client.join(room);
    this.logger.log(`User joined blog chat: ${room}`);
    client.emit('joinedBlogChat', { room });
  }

  @SubscribeMessage('sendBlogMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { blogId: number; senderId: number; text: string },
  ) {
    const room = `blog_${data.blogId}`;

    // Save in DB
    const message = await this.blogChatService.sendMessage(
      data.blogId,
      data.senderId,
      data.text,
    );

    // Broadcast to everyone in the room
    this.server.to(room).emit('newBlogMessage', message);

    // Send confirmation to sender
    client.emit('messageSent', message);

    this.logger.log(
      `Message broadcasted in ${room}: ${JSON.stringify(message)}`,
    );
  }
}
