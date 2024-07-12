import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The email address to register the user account with. Must be a valid email format.',
    example: 'newuser@example.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The password to register the user account with. Must be at least 8 characters long.',
    example: 'P@ssw0rd123',
  })
  password: string;
}
