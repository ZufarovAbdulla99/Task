import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    example: 'John Doe',
    type: 'string',
    required: true,
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    example: 'john@gmail.com',
    type: 'string',
    required: true,
    description: 'Unique email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiPropertyOptional({
    example: 'secret123',
    type: 'string',
    required: true,
    description: 'Password with at least 6 characters',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;
}
