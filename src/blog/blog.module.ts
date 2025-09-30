import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [PassportModule, ConfigModule],
  controllers: [BlogController],
  providers: [BlogService, PrismaService, JwtStrategy],
})
export class BlogModule {}
