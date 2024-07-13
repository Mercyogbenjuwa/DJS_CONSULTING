import { Controller, Post, Body, HttpStatus, HttpCode, HttpException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseFormat, ResponseMessage, StatusCode } from 'src/common/constants';
import { LoginDto } from './dto/login.dto/login.dto';
import { RegisterDto } from './dto/register.dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login a user', description: 'Logs in a user with email and password.' })
  @HttpCode(StatusCode.SUCCESS) 
  async login(@Body() loginDto: LoginDto) {
    try {
      const data = await this.authService.login(loginDto);
      return ResponseFormat(StatusCode.SUCCESS, ResponseMessage.LOGIN_SUCCESS, data);
    } catch (error) {
      throw new HttpException(
        ResponseFormat(StatusCode.UNAUTHORIZED, error.message),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }



  @Post('register')
  @ApiOperation({ summary: 'Register a user', description: 'Registers a new user with email and password.' })
  @HttpCode(StatusCode.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    try {
      const data = await this.authService.register(registerDto);
      return ResponseFormat(StatusCode.CREATED, ResponseMessage.REGISTRATION_SUCCESS, data);
    } catch (error) {
      if (error.message === 'User already exists') {
        throw new HttpException(
          ResponseFormat(StatusCode.CONFLICT, 'Unable to register user: User already exists'),
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          ResponseFormat(StatusCode.INTERNAL_SERVER_ERROR, 'Unable to register user'),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}

