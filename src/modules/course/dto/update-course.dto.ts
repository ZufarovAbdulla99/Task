import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsMongoId,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Node.js Professional',
    description: 'Yangilangan kurs nomi',
    minLength: 5,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Yangilangan kurs tarkibi',
    description: 'Yangilangan kurs tavsifi',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    required: false,
    example: '2023-10-01T00:00:00Z',
    description: 'Yangilangan boshlanish sanasi',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    required: false,
    example: '2024-01-31T23:59:59Z',
    description: 'Yangilangan tugash sanasi',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '507f1f77bcf86cd799439012',
    description: `Yangilangan o'qituvchi IDsi`,
  })
  @IsOptional()
  @IsMongoId()
  teacher?: string;
}
