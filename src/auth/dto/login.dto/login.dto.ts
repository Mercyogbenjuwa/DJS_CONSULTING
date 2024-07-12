import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The email address associated with the user account. Must be a valid email format.',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The password for the user account. Must be at least 8 characters long.',
    example: 'P@ssw0rd123',
  })
  password: string;
}
