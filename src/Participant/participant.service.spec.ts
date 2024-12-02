import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsService } from './participant.service';
import { getModelToken } from '@nestjs/mongoose';
import { Participant } from './schemas/shema.participant';
import { Event } from '../events/schemas/schema.event';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('ParticipantsService', () => {
  let service: ParticipantsService;
  let participantModel: Model<Participant>;
  let eventModel: Model<Event>;

  class MockParticipantModel {
    constructor(private data: any) {
      return {
        ...data,
        save: jest.fn().mockResolvedValue(data),
      };
    }

    static find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    });
  }

  const mockEventModel = {
    findById: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipantsService,
        {
          provide: getModelToken(Participant.name),
          useValue: MockParticipantModel,
        },
        {
          provide: getModelToken(Event.name),
          useValue: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<ParticipantsService>(ParticipantsService);
    participantModel = module.get<Model<Participant>>(getModelToken(Participant.name));
    eventModel = module.get<Model<Event>>(getModelToken(Event.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createParticipant', () => {
    it('should create a participant when event exists', async () => {
      const createParticipantDto = {
        eventId: '507f1f77bcf86cd799439011',
        username: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
      };

      const mockEvent = { _id: createParticipantDto.eventId };
      const mockParticipant = {
        event: createParticipantDto.eventId,
        username: createParticipantDto.username,
        email: createParticipantDto.email,
        phoneNumber: createParticipantDto.phoneNumber,
      };

      (eventModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockEvent),
      });

      const result = await service.createParticipant(createParticipantDto);

      expect(eventModel.findById).toHaveBeenCalledWith(createParticipantDto.eventId);
      expect(result).toMatchObject(mockParticipant);
    });
  });

  describe('getAllParticipants', () => {
    it('should return all participants', async () => {
      const mockParticipants = [
        {
          eventId: '507f1f77bcf86cd799439011',
          username: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '1234567890',
        },
        {
          eventId: '507f1f77bcf86cd799439012',
          username: 'Jane Doe',
          email: 'jane@example.com',
          phoneNumber: '0987654321',
        },
      ];

      MockParticipantModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockParticipants),
        }),
      });

      const result = await service.getAllParticipants();

      expect(result).toEqual(mockParticipants);
      expect(MockParticipantModel.find).toHaveBeenCalled();
    });
  });
});