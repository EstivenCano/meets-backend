import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddMessageDto {
  @IsString()
  chatName: string;

  @IsNumber()
  authorId: number;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  createdAt: string;
}
