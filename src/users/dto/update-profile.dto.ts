import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  bio: string;

  @IsOptional()
  @IsUrl()
  picture: string;
}
