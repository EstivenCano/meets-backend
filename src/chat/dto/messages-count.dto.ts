import { IsString } from 'class-validator';

export class MessageCountDto {
  @IsString()
  chatName: string;
}
