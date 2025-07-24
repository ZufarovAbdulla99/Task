import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'john@gmail.com',
    type: 'string',
    required: true,
    description: 'User email for login',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    type: 'string',
    required: true,
    description: 'User password for login',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}