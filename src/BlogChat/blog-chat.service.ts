import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class BlogChatService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(blogId: number, senderId: number, text: string) {
    // Ensure chat exists for the blog
    let chat = await this.prisma.blogChat.findUnique({
      where: { blogId },
    });

    if (!chat) {
      chat = await this.prisma.blogChat.create({
        data: { blogId },
      });
    }

    // Save message using chatId
    return this.prisma.blogMessage.create({
      data: {
        text,
        senderId,
        chatId: chat.id,
      },
      include: {
        sender: true,
      },
    });
  }

  async getMessages(blogId: number) {
    const chat = await this.prisma.blogChat.findUnique({
      where: { blogId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: true },
        },
      },
    });

    return chat ? chat.messages : [];
  }
}
