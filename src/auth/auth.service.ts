import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    return this.userService.createUser(signupDto);
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return { token, user };
  }

  async validateUser(email: string, password: string) {
    return this.userService.validateUserCredentials(email, password);
  }
}
