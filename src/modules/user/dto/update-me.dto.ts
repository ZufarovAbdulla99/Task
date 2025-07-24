import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateMeDto {
  @ApiPropertyOptional({
    description: 'Yangilanadigan ism',
    example: 'Ali',
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: "Ism string bo'lishi kerak" })
  @MinLength(2, { message: "Ism kamida 2 ta belgidan iborat bo'lishi kerak" })
  name?: string;

  @ApiPropertyOptional({
    description: 'Yangilanadigan email manzili',
    example: 'ali78@gmail.com',
    format: 'gmail',
  })
  @IsOptional()
  @IsEmail({}, { message: "To'g'ri email formatini kiriting" })
  email?: string;
}