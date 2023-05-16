import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  name: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  userIds: number[];
}
