import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async createBlog(authorId: number, title: string, content: string) {
    return this.prisma.blog.create({
      data: { title, content, authorId },
    });
  }

  async getMyBlogs(authorId: number) {
    return this.prisma.blog.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBlogById(id: number) {
    return this.prisma.blog.findUnique({
      where: { id },
      include: { author: true },
    });
  }
  async updateBlog(id: number, userId: number, updateBlogDto: UpdateBlogDto) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');

    console.log('blog.authorId:', blog.authorId, 'userId:', userId);

    if (blog.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to update this blog');
    }

    return this.prisma.blog.update({ where: { id }, data: updateBlogDto });
  }

  async deleteBlog(id: number, userId: number) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (blog.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this blog');
    }

    return this.prisma.blog.delete({
      where: { id },
    });
  }
}
