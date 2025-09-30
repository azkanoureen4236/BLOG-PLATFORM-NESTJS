import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async addComment(blogId: number, userId: number, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        text: dto.text,
        blogId,
        userId,
      },
    });
  }

  async getComments(blogId: number) {
    return this.prisma.comment.findMany({
      where: { blogId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteComment(commentId: number, userId: number, role: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    // Author or ADMIN can delete
    if (comment.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('You cannot delete this comment');
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
