import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    type: 'string',
    required: true,
    description: 'User name for register',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john@gmail.com',
    type: 'string',
    required: true,
    description: 'User email for register',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    type: 'string',
    required: true,
    description: 'User password for register',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
