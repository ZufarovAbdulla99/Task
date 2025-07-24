import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    type: 'string',
    required: true,
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john@gmail.com',
    type: 'string',
    required: true,
    description: 'Unique email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'secret123',
    type: 'string',
    required: true,
    description: 'Password with at least 6 characters',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}