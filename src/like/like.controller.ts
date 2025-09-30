import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('blogs/:id')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('like')
  @UseGuards(AuthGuard('jwt'))
  async toggleLike(@Param('id', ParseIntPipe) blogId: number, @Request() req) {
    return this.likeService.likeBlog(req.user.userId, blogId);
  }

  @Get('likes')
  async getLikes(@Param('id', ParseIntPipe) blogId: number) {
    const count = await this.likeService.countLikes(blogId);
    return { blogId, likes: count };
  }
}
