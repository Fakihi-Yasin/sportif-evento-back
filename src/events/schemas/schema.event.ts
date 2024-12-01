import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/schemas/shema.user';
// import { EventType } from './event-type.enum';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  // @Prop({ required: true })
  // location: string;

  @Prop({ type: Number, default: 0, min: 0 })
  capacity: number;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  organizerId: User;
}

export const EventSchema = SchemaFactory.createForClass(Event);
