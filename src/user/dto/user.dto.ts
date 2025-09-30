import { IsOptional, IsString } from 'class-validator';

export class UserDto {
  // @IsOptional()
  // @IsString()
  name: string;

  email: string;

  password: string;
}
