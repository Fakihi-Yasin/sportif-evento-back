import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async createEvent(
    createEventDto: CreateEventDto,
    organizerId: string,
  ): Promise<Event> {
    try {
      // Use the model's constructor directly
      const newEvent = new this.eventModel({
        ...createEventDto,
        organizerId,
        // Explicitly set capacity to 0 if not provided
        capacity: createEventDto.capacity ?? 0,
      });

      // Save the event and return the result
      return await newEvent.save();
    } catch (error) {
      // Log the specific error for debugging
      console.error('Error creating event:', error);

      // Throw a BadRequestException with a specific message
      throw new BadRequestException("Impossible de créer l'événement");
    }
  }

  // async getAllEvents(): Promise<Event[]> {
  //   try {
  //     return await this.eventModel.find().exec();
  //   } catch (error) {
  //     throw new NotFoundException('Unable to retrieve events');
  //   }
  // }

  // async getEventDetails(eventId: string): Promise<Event> {
  //   try {
  //     const event = await this.eventModel.findById(eventId).exec();
  //     if (!event) {
  //       throw new NotFoundException('Event not found');
  //     }
  //     return event;
  //   } catch (error) {
  //     throw new NotFoundException('event not found');
  //   }
  // }
  async geteventsByorgnizer(organizerId: string): Promise<Event[]> {
    try {
      return await this.eventModel
        .find({ organizerId: organizerId })
        .populate('organizerId')
        .exec();
    } catch (error) {
      throw new NotFoundException(
        `unable to retrive events for organizer ${organizerId}`,
      );
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const updatedEvent = await this.eventModel.findByIdAndUpdate(
      id,
      updateEventDto,
      { new: true }, // Return the updated document
    );

    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found.`);
    }

    return updatedEvent;
  }

  async deleteEvent(eventId: string): Promise<void> {
    const result = await this.eventModel.findByIdAndDelete(eventId);

    if (!result) {
      throw new NotFoundException('Événement non trouvé');
    }
  }

  //   async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
  //     return this.eventModel.find({ organizerId });
  //   }
}
