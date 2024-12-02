import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsController } from './participant.controller';
import { ParticipantsService } from './participant.service';
import { CreateParticipantDto } from './dto/create-participant.dto';

describe('ParticipantsController', () => {
  let controller: ParticipantsController;
  let service: ParticipantsService;

  // Create mock service
  const mockParticipantsService = {
    createParticipant: jest.fn(),
    getAllParticipants: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipantsController],
      providers: [
        {
          provide: ParticipantsService,
          useValue: mockParticipantsService,
        },
      ],
    }).compile();

    controller = module.get<ParticipantsController>(ParticipantsController);
    service = module.get<ParticipantsService>(ParticipantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createParticipant', () => {
    it('should create a new participant', async () => {
      const createParticipantDto: CreateParticipantDto = {
        eventId: '507f1f77bcf86cd799439011',
        username: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
      };

      const expectedResult = {
        _id: '507f1f77bcf86cd799439013',
        ...createParticipantDto,
      };

      mockParticipantsService.createParticipant.mockResolvedValue(expectedResult);

      const result = await controller.createParticipant(createParticipantDto);

      expect(result).toEqual(expectedResult);
      expect(mockParticipantsService.createParticipant).toHaveBeenCalledWith(
        createParticipantDto,
      );
    });
  });

  describe('getAllParticipants', () => {
    it('should return an array of participants', async () => {
      const expectedResult = [
        {
          _id: '507f1f77bcf86cd799439013',
          eventId: '507f1f77bcf86cd799439011',
          username: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '1234567890',
        },
        {
          _id: '507f1f77bcf86cd799439014',
          eventId: '507f1f77bcf86cd799439012',
          username: 'Jane Doe',
          email: 'jane@example.com',
          phoneNumber: '0987654321',
        },
      ];

      mockParticipantsService.getAllParticipants.mockResolvedValue(expectedResult);

      const result = await controller.getAllParticipants();

      expect(result).toEqual(expectedResult);
      expect(mockParticipantsService.getAllParticipants).toHaveBeenCalled();
    });
  });
});