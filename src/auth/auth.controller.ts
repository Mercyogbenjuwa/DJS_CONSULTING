import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
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
  @ApiResponse({ status: HttpStatus.OK, description: ResponseMessage.LOGIN_SUCCESS })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const data = await this.authService.login(loginDto);
      return ResponseFormat(StatusCode.SUCCESS, ResponseMessage.LOGIN_SUCCESS, data);
    } catch (error) {
      return ResponseFormat(StatusCode.UNAUTHORIZED, error.message);
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a user', description: 'Registers a new user with email and password.' })
  @ApiResponse({ status: StatusCode.CREATED, description: ResponseMessage.REGISTRATION_SUCCESS })
  @ApiResponse({ status: StatusCode.CONFLICT, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const data = await this.authService.register(registerDto);
      return ResponseFormat(StatusCode.CREATED, ResponseMessage.REGISTRATION_SUCCESS, data);
    } catch (error) {
      return ResponseFormat(StatusCode.CONFLICT, error.message);
    }
  }
}
