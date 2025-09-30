import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleBookmark(userId: number, blogId: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });
    if (!blog) {
      throw new Error('Blog not found');
    }
    const existingBookmark = await this.prisma.bookmark.findFirst({
      where: {
        userId: userId,
        blogId: blogId,
      },
    });
    if (existingBookmark) {
      await this.prisma.bookmark.delete({ where: { id: existingBookmark.id } });
      return { message: 'Bookmark removed successfully' };
    } else {
      await this.prisma.bookmark.create({
        data: {
          userId,
          blogId,
        },
      });
      return { message: 'Bookmark added successfully' };
    }
  }
  async getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: { userId },
      include: { blog: true },
    });
  }
}
