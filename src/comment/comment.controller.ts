import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from './comment.service';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('blogs/:id/comments')
  @UseGuards(AuthGuard('jwt'))
  addComment(
    @Param('id', ParseIntPipe) blogId: number,
    @Request() req,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.addComment(blogId, req.user.userId, dto);
  }

  @Get('blogs/:id/comments')
  getComments(@Param('id', ParseIntPipe) blogId: number) {
    return this.commentService.getComments(blogId);
  }

  @Delete('comments/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteComment(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.commentService.deleteComment(
      id,
      req.user.userId,
      req.user.role,
    );
  }
}
