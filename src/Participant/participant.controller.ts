import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ParticipantsService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { Participant } from './schemas/shema.participant';

@ApiTags('participants')
@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new participant for an event' })
  @ApiResponse({
    status: 201,
    description: 'Participant created successfully',
    type: Participant,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found or participant already registered',
  })
  async createParticipant(
    @Body() createParticipantDto: CreateParticipantDto,
  ): Promise<Participant> {
    return this.participantsService.createParticipant(createParticipantDto);
  }

  @Get('AllParticipants')
  async getAllParticipants(): Promise<Participant[]> {
    return this.participantsService.getAllParticipants();
  }
}
