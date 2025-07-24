import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Make presentation',
    type: 'string',
    required: true,
    description: 'Title of the task',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Prepare a PowerPoint about MongoDB basics',
    type: 'string',
    required: false,
    description: 'Detailed description of the task',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '2025-08-01T12:00:00Z',
    type: 'string',
    required: false,
    description: 'Deadline for the task (ISO format)',
  })
  @IsOptional()
  @IsDateString()
  deadline?: Date;

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'in_progress', 'completed'],
    required: false,
    description: 'Status of the task',
  })
  @IsOptional()
  @IsEnum(['pending', 'in_progress', 'completed'])
  status?: string;

  @ApiProperty({
    example: ['64f6d8d4d2f4c7e0a1234567'],
    type: [String],
    required: false,
    description: 'List of student IDs assigned to this task',
  })
  @IsOptional()
  @IsArray()
  assignedTo?: string[];
}