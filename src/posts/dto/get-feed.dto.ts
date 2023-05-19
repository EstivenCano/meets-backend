import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class GetFeedDto {
  @IsNumber()
  @Min(1)
  page: number;

  @IsNumber()
  @Min(1)
  @Max(30)
  perPage: number;

  @IsOptional()
  @IsString()
  searchString: string;

  @IsOptional()
  @IsNumber()
  byAuthor: number;
}
