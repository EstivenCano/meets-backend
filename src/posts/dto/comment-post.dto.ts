import { IsEmail, IsString } from 'class-validator';

export class CommentPostDto {
  @IsString()
  content: string;
}
