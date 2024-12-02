import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { NotFoundException } from '@nestjs/common';

jest.mock('../auth/auth.guard', () => ({
  AuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

describe('EventController', () => {
  let controller: EventController;
  let eventService: EventService;

  const mockEventService = {
    createEvent: jest.fn(),
    update: jest.fn(),
    geteventsByorgnizer: jest.fn(),
    deleteEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    eventService = module.get<EventService>(EventService);
  });

  describe('createEvent', () => {
    it('should create an event', async () => {
      const createEventDto: CreateEventDto = {
        name: 'Test Event',
        description: 'Test Description',
        date: new Date(),
        location: 'Test Location',
        capacity: 100,
      };

      const mockRequest = {
        user: { id: 'user123' },
      };

      const expectedResult = {
        id: 'event123',
        ...createEventDto,
        organizerId: 'user123',
      };

      mockEventService.createEvent.mockResolvedValue(expectedResult);

      const result = await controller.createEvent(createEventDto, mockRequest);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateEvent', () => {
    it('should update an event', async () => {
      const updateEventDto: UpdateEventDto = {
        name: 'Updated Event',
      };

      const expectedResult = {
        id: 'event123',
        name: 'Updated Event',
      };

      mockEventService.update.mockResolvedValue(expectedResult);

      const result = await controller.updateEvent('event123', updateEventDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getMyEvents', () => {
    it('should return events for user', async () => {
      const mockRequest = {
        user: { id: 'user123' },
      };

      const expectedEvents = [
        { id: 'event1', name: 'Event 1' },
        { id: 'event2', name: 'Event 2' },
      ];

      mockEventService.geteventsByorgnizer.mockResolvedValue(expectedEvents);

      const result = await controller.getMyEvents(mockRequest);
      expect(result).toEqual(expectedEvents);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const eventId = 'event123';
      mockEventService.deleteEvent.mockResolvedValue(undefined);
      
      await controller.deleteEvent(eventId);
      expect(mockEventService.deleteEvent).toHaveBeenCalledWith(eventId);
    });
  });
});