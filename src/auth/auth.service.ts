import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private hashPassword(password: string): string {
    const secret = process.env.PASSWORD_SECRET || 'default-secret';
    return crypto.createHmac('sha256', secret).update(password).digest('hex');
  }

  async register(registerDto: RegisterDto) {
    const { name, lastname, email, password } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = this.hashPassword(password);

    try {
      const newUser = await this.usersService.createUserWithHashedPassword({
        name,
        lastname,
        email,
        password: hashedPassword,
      });

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('user not exists');
    }

    const hashedPassword = this.hashPassword(password);

    if (hashedPassword !== user.password) {
      throw new UnauthorizedException('user not exists');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      name: user.name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      },
    };
  }
}
