import { IsString, IsEmail, IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantDto {
  @IsString()
  @IsMongoId() // Ensures it's a valid MongoDB ObjectId
  eventId: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;
}
