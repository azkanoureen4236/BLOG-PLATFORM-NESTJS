import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/guards/role/role.dacorators';
import { Role } from 'src/guards/role/role.enum';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { auth } from 'firebase-admin';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Post('create')
  create(@Request() req, @Body() body: { title: string; content: string }) {
    return this.blogService.createBlog(
      req.user.userId,
      body.title,
      body.content,
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('myblogs')
  getMyBlogs(@Request() req) {
    return this.blogService.getMyBlogs(req.user.sub);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    const blog = await this.blogService.getBlogById(Number(id));
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Req() req: any,
  ) {
    console.log('Normalized user:', req.user);
    const userId = Number(req.user.id);
    return this.blogService.updateBlog(Number(id), userId, updateBlogDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteBlog(@Param('id') id: string, @Req() req: any) {
    console.log('Normalized user:', req.user);
    const userId = req.user.id;
    return this.blogService.deleteBlog(Number(id), userId);
  }

  @Get(':id/share')
  shareBlog(@Param('id', ParseIntPipe) id: number) {
    const shareUrl = `http://localhost:3000/blogs/${id}`;
    return { shareUrl };
  }
}
