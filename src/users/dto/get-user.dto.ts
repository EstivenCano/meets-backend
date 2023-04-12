import { IsEmail, IsString } from 'class-validator';

export class GetUserDto {
  @IsString()
  @IsEmail()
  email: string;
}
