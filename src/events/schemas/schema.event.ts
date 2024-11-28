import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import { EventType } from './event-type.enum';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ type: Number, default: 0, min: 0 })
  capacity: number;

  //   @Prop({ default: [] })
  //   participants: string[];

  @Prop({ required: true })
  organizerId: string; // ID de l'organisateur qui a créé l'événement
}

export const EventSchema = SchemaFactory.createForClass(Event);
