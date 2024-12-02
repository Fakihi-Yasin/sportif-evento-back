import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/shema.user';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDocument>;

  const mockUser = {
    name: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    password: 'password123'
  };

  // Updated mock model
  const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            ...mockUserModel,
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Mock findOne to return null (user doesn't exist)
      mockUserModel.findOne.mockResolvedValue(null);

      // Create a mock saved user with toObject method
      const savedUser = {
        ...mockUser,
        toObject: () => ({ ...mockUser }),
      };

      // Mock the model's constructor and save method
      jest.spyOn(model, 'new').mockImplementation(() => ({
        ...mockUser,
        save: jest.fn().mockResolvedValue(savedUser),
      } as any));

      const result = await service.createUser(mockUser);

      expect(result).toBeDefined();
      expect(result.password).toBeUndefined();
      expect(result.email).toBe(mockUser.email);
      expect(result.name).toBe(mockUser.name);
      expect(result.lastname).toBe(mockUser.lastname);
    });

    it('should throw ConflictException if user email already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.createUser(mockUser)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('createUserWithHashedPassword', () => {
    it('should create a new user with hashed password successfully', async () => {
      // Mock findOne to return null (user doesn't exist)
      mockUserModel.findOne.mockResolvedValue(null);

      // Create a mock saved user with toObject method
      const savedUser = {
        ...mockUser,
        toObject: () => ({ ...mockUser }),
      };

      // Mock the model's constructor and save method
      jest.spyOn(model, 'new').mockImplementation(() => ({
        ...mockUser,
        save: jest.fn().mockResolvedValue(savedUser),
      } as any));

      const result = await service.createUserWithHashedPassword(mockUser);

      expect(result).toBeDefined();
      expect(result.password).toBeUndefined();
      expect(result.email).toBe(mockUser.email);
      expect(result.name).toBe(mockUser.name);
      expect(result.lastname).toBe(mockUser.lastname);
    });

    it('should throw ConflictException if user email already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.createUserWithHashedPassword(mockUser)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      mockUserModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      }));

      const result = await service.findByEmail('john@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserModel.findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValueOnce(null),
      }));

      const result = await service.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      mockUserModel.findById.mockResolvedValue(mockUser);

      const result = await service.findById('someId');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      const result = await service.findById('nonexistentId');
      expect(result).toBeNull();
    });
  });
});