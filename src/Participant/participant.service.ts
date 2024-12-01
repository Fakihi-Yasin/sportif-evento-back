import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Participant, ParticipantDocument } from './schemas/shema.participant';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { Event } from '../events/schemas/schema.event';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel(Participant.name)
    private participantModel: Model<ParticipantDocument>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
  ) {}

  async createParticipant(
    createParticipantDto: CreateParticipantDto,
  ): Promise<Participant> {
    // Validate that the event exists first
    const event = await this.eventModel.findById(createParticipantDto.eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const participant = new this.participantModel({
      event: createParticipantDto.eventId, // This should be a valid MongoDB ObjectId
      username: createParticipantDto.username,
      email: createParticipantDto.email,
      phoneNumber: createParticipantDto.phoneNumber,
    });

    return participant.save();
  }
}
