import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  capacity?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organizerId?: string; // Ensure organizerId can also be updated, if required.
}
