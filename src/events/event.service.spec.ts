import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/schema.event';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

// Renamed interface to IEvent to avoid naming conflict
interface IEvent {
  _id: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  organizerId: string;
}

describe('EventService', () => {
  let service: EventService;
  let model: Model<IEvent>;

  const mockEvent: IEvent = {
    _id: 'eventId123',
    name: 'Test Event',
    description: 'Test Description',
    date: new Date('2024-12-31'),
    location: 'Test Location',
    capacity: 6,
    organizerId: 'organizerId123',
  };

  const mockEventModel = {
    new: jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({ ...dto, _id: 'eventId123' }),
    })),
    constructor: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
    populate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getModelToken(Event.name),
          useValue: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    model = module.get<Model<IEvent>>(getModelToken(Event.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // describe('createEvent', () => {
  //   it('should create an event successfully', async () => {
  //     const createEventDto: CreateEventDto = {
  //       name: 'Test Event',
  //       description: 'Test Description',
  //       date: new Date('2024-12-31'),
  //       location: 'Test Location',
  //       capacity: 100,
  //     };

  //     const savedEvent = { ...mockEvent };
  //     mockEventModel.new.mockReturnValue({ save: () => savedEvent });

  //     const result = await service.createEvent(
  //       createEventDto,
  //       'organizerId123',
  //     );
  //     expect(result).toEqual(savedEvent);
  //   });

  //   it('should set default capacity to 0 when not provided', async () => {
  //     const createEventDto: CreateEventDto = {
  //       name: 'Test Event',
  //       description: 'Test Description',
  //       date: new Date('2024-12-31'),
  //       location: 'Test Location',
  //     };

  //     const savedEvent = { ...mockEvent, capacity: 0 };
  //     mockEventModel.new.mockReturnValue({ save: () => savedEvent });

  //     await service.createEvent(createEventDto, 'organizerId123');
  //     expect(mockEventModel.save).toHaveBeenCalledTimes(1);
  //   });

  //   it('should throw BadRequestException when creation fails', async () => {
  //     mockEventModel.new.mockImplementation(() => {
  //       throw new Error();
  //     });

  //     await expect(
  //       service.createEvent({} as CreateEventDto, 'organizerId123'),
  //     ).rejects.toThrow(BadRequestException);
  //   });
  // });

  describe('geteventsByorgnizer', () => {
    it('should return events for an organizer', async () => {
      const events = [mockEvent];
      mockEventModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(events),
        }),
      });

      const result = await service.geteventsByorgnizer('organizerId123');
      expect(result).toEqual(events);
      expect(mockEventModel.find).toHaveBeenCalledWith({
        organizerId: 'organizerId123',
      });
    });

    it('should throw NotFoundException when retrieval fails', async () => {
      mockEventModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error()),
        }),
      });

      await expect(
        service.geteventsByorgnizer('organizerId123'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an event successfully', async () => {
      const updateEventDto: UpdateEventDto = {
        name: 'Updated Event',
        capacity: 200,
      };

      const updatedEvent = {
        ...mockEvent,
        ...updateEventDto,
      };

      mockEventModel.findByIdAndUpdate.mockResolvedValue(updatedEvent);

      const result = await service.update('eventId123', updateEventDto);
      expect(result).toEqual(updatedEvent);
      expect(mockEventModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'eventId123',
        updateEventDto,
        { new: true },
      );
    });

    it('should throw NotFoundException when event not found', async () => {
      mockEventModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        service.update('nonexistentId', {} as UpdateEventDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event successfully', async () => {
      mockEventModel.findByIdAndDelete.mockResolvedValue(mockEvent);

      await expect(service.deleteEvent('eventId123')).resolves.not.toThrow();
      expect(mockEventModel.findByIdAndDelete).toHaveBeenCalledWith(
        'eventId123',
      );
    });

    it('should throw NotFoundException when event not found', async () => {
      mockEventModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.deleteEvent('nonexistentId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
