import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { PrismaService } from 'prisma/prisma.service';
import { BookmarkService } from './bookmark.service';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService, PrismaService],
})
export class BookmarkModule {}
