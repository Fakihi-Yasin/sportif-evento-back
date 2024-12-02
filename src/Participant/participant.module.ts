import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParticipantsService } from './participant.service';
import { ParticipantsController } from './participant.controller';
import { Participant, ParticipantSchema } from './schemas/shema.participant';
import { Event, EventSchema } from '../events/schemas/schema.event';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participant.name, schema: ParticipantSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
