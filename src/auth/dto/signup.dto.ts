import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Role } from '@prisma/client';

export class SignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role; // <-- enum instead of string

  @IsOptional()
  @IsString()
  subRole?: string;
}
