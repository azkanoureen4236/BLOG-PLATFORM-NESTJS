import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('blogs')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/bookmark')
  toggleBookmark(@Param('id', ParseIntPipe) blogId: number, @Request() req) {
    return this.bookmarkService.toggleBookmark(blogId, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/bookmarks')
  getBookmarks(@Param('id', ParseIntPipe) blogId: number) {
    return this.bookmarkService.getBookmarks(blogId);
  }
}
