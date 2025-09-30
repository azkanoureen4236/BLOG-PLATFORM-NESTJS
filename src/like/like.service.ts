import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async likeBlog(userId: number, blogId: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    const existingLike = await this.prisma.like.findFirst({
      where: {
        userId: userId,
        blogId: blogId,
      },
    });
    if (existingLike) {
      await this.prisma.like.delete({ where: { id: existingLike.id } });
    } else {
      await this.prisma.like.create({
        data: {
          userId,
          blogId,
        },
      });
      return { message: 'Blog liked successfully' };
    }
  }
  async countLikes(blogId: number) {
    return this.prisma.like.count({
      where: { blogId },
    });
  }
}
