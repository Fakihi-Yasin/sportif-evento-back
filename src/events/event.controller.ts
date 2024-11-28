import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
// import { Expose } from 'class-transformer';
import { CreateEventDto } from './dto/event.dto';
import { AuthGuard } from '../auth/auth.guard'; // Ajustez le chemin

// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { EventService } from './event.service';

@Controller('events')
@UseGuards(AuthGuard)

// @UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @Req() req: Request,
  ) {
    const organizer = req.user['id'];
    return this.eventService.createEvent(createEventDto, organizer);
  }
}
