import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  bio: string;

  @IsOptional()
  @IsUrl()
  picture: string;
}
