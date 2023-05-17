import { IsNumber, Min, Max, IsString } from 'class-validator';

export class LoadMessagesDto {
  @IsString()
  chatName: string;

  @IsNumber()
  @Min(1)
  page: number;

  @IsNumber()
  @Min(1)
  @Max(30)
  perPage: number;
}
