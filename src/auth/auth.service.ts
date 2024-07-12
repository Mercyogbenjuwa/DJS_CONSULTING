import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user/user';
import { LoginDto } from './dto/login.dto/login.dto';
import { RegisterDto } from './dto/register.dto/register.dto';
import { logger } from 'src/common/logger';

@Injectable()
export class AuthService {
  private logPrefix: string = '[AUTH_SERVICE_LOGS]';
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
      logger.info(
        `${this.logPrefix} User Validated successfully: ${JSON.stringify(
          user,
        )}`,
      );
      return null;
    } catch (error) {
      logger.error(`Failed to validate user: ${JSON.stringify(error)}`);
      throw new Error(`Unable to validate user: ${error.message}`);
    }
  }

  async login(data: LoginDto): Promise<{ accessToken: string }> {
    try {
      const user = await this.validateUser(data.email, data.password);
      if (!user) {
        throw new ConflictException('Invalid credentials');
      }
      const payload = { email: user.email, sub: user.id, isAdmin: user.isAdmin };
      logger.info(
        `${this.logPrefix} Login user: ${JSON.stringify(
          payload,
        )}`,
      );
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
      logger.error(`Failed to login user: ${JSON.stringify(error)}`);
      throw new Error(`Unable to login: ${error.message}`);
    }
  }


  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, profileUrl } = registerDto;
    try {
      const existingUser = await this.usersRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = this.usersRepository.create({ email, password: hashedPassword, profileUrl });
      logger.info(
        `${this.logPrefix} Registered user: ${JSON.stringify(
          newUser,
        )}`,
      );
      return await this.usersRepository.save(newUser);
    } catch (error) {
      logger.error(`Failed to register user: ${JSON.stringify(error)}`);
      throw new Error(`Unable to register user: ${error.message}`);
    }
  }
}

