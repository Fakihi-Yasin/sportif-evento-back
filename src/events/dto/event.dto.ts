import { IsDate, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  location: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Le nombre maximum de participants doit être positif' })
  capacity?: number;
}
