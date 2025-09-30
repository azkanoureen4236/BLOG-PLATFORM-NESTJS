import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { BlogChatGateway } from './blog-chat.gateway';
import { BlogChatService } from './blog-chat.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [BlogChatGateway, BlogChatService],
})
export class ChatModule {}
