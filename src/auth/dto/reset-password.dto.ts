import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  userId: string;

  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  password: string;
}
