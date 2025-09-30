import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'prisma/prisma.module';
import { BlogModule } from './blog/blog.module';
import { JwtModule } from '@nestjs/jwt';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ChatModule } from './BlogChat/blog-chat.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    BlogModule,
    JwtModule,
    CommentModule,
    LikeModule,
    BookmarkModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
