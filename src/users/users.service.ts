import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/shema.user';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Existing createUser method (if needed)
  async createUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const { name, lastname, email, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    try {
      const newUser = new this.userModel({
        name,
        lastname,
        email,
        password,
      });

      // Save user and exclude password from return
      const savedUser = await newUser.save();

      // Explicitly remove password using object destructuring
      const { password: _, ...userWithoutPassword } = savedUser.toObject();

      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // New method for creating user with pre-hashed password
  async createUserWithHashedPassword(userData: {
    name: string;
    lastname: string;
    email: string;
    password: string;
  }): Promise<Partial<User>> {
    const { name, lastname, email, password } = userData;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    try {
      const newUser = new this.userModel({
        name,
        lastname,
        email,
        password,
      });

      // Save user and exclude password from return
      const savedUser = await newUser.save();

      // Explicitly remove password using object destructuring
      const { password: _, ...userWithoutPassword } = savedUser.toObject();

      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }
}
