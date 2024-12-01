import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
// import { Expose } from 'class-transformer';
import { CreateEventDto } from './dto/event.dto';
import { AuthGuard } from '../auth/auth.guard'; // Ajustez le chemin

// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventService } from './event.service';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
@UseGuards(AuthGuard)

// @UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(AuthGuard) // Assuming you have an AuthGuard for authentication
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @Req() req: any, // Use this to access the authenticated user's details
  ): Promise<Event> {
    const organizerId = req.user.id; // Extract organizer ID from the authenticated user
    return await this.eventService.createEvent(createEventDto, organizerId);
  }

  // @Get()
  // async getAllEvents() {
  //   return this.eventService.getAllEvents();
  // }

  @Patch(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const updatedEvent = await this.eventService.update(id, updateEventDto);
    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found.`);
    }
    return updatedEvent;
  }


  

  @Get('my-events')
  @UseGuards(AuthGuard) // Assuming you have authentication in place
  async getMyEvents(@Request() req): Promise<Event[]> {
    const organizerId = req.user.id; // Assuming the authenticated user ID is available in req.user.id
    return this.eventService.geteventsByorgnizer(organizerId);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') eventId: string) {
    return this.eventService.deleteEvent(eventId);
  }
}
