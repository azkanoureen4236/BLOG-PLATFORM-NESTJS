import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBlogDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;
}
