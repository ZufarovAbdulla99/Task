import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDateString,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Node.js Advanced',
    description: 'Course title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Advanced Node.js concepts',
    description: 'Course description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '2023-01-01',
    description: 'Course start date',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2023-06-30',
    description: 'Course end date',
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({
    example: '64f6d8d4d2f4c7e0a1234567',
    description: 'Teacher ID',
  })
  @IsNotEmpty()
  @IsString()
  teacher: string;
}