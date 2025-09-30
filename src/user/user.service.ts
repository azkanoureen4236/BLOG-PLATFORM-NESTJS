import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(signupDto: SignupDto) {
    try {
      const hashed = await bcrypt.hash(signupDto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          name: signupDto.name,
          email: signupDto.email,
          password: hashed,
          role: (signupDto.role as Role) || Role.USER,
          subRole: signupDto.role === 'ADMIN' ? signupDto.subRole : null,
        },
      });

      const { password, ...safe } = user;
      return safe;
    } catch (e) {
      if (e?.code === 'P2002') {
        throw new InternalServerErrorException('Email already registered');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async validateUserCredentials(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) return null;

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;

    const { password: _, ...safe } = user;
    return safe;
  }
}
