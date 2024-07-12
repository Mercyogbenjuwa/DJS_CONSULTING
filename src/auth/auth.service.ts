import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user/user';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (user && await bcrypt.compare(password, user.password)) {
        return user;
      }
      return null;
    } catch (error) {
      throw new Error(`Unable to validate user: ${error.message}`);
    }
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    try {
      const user = await this.validateUser(email, password);
      if (!user) {
        throw new ConflictException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user.id, isAdmin: user.isAdmin };

      return {
        accessToken: this.jwtService.sign(
          { ...payload, type: 'access' }, 
          {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES, 
          },
        ),
      };
    } catch (error) {
      throw new Error(`Unable to login: ${error.message}`);
    }
  }


  async register(email: string, password: string): Promise<User> {
    try {
      const existingUser = await this.usersRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = this.usersRepository.create({ email, password: hashedPassword, isAdmin: true });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      throw new Error(`Unable to register user: ${error.message}`);
    }
  }
}
