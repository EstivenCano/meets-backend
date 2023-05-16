import { IsNumber, IsString } from 'class-validator';

export class AddMessageListDto {
  @IsNumber()
  chatId: number;

  @IsNumber()
  authorId: number;

  @IsString()
  content: string;
}
