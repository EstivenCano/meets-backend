import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsOptional()
  @IsBoolean()
  publish: boolean;
}
