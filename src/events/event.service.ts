import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/event.dto';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async createEvent(
    createEventDto: CreateEventDto,
    organizerId: string,
  ): Promise<Event> {
    try {
      const newEvent = new this.eventModel({
        ...createEventDto,
        organizerId,
        capacity: createEventDto.capacity || 0,
      });

      return await newEvent.save();
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
      throw new BadRequestException("Impossible de créer l'événement");
    }
  }

  //   async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
  //     return this.eventModel.find({ organizerId });
  //   }
}
