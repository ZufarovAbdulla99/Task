import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class CourseResponseDto {
  @ApiProperty({
    type: String,
    example: '507f1f77bcf86cd799439015',
    description: 'Kurs IDsi',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Node.js Advanced',
    description: 'Kurs nomi',
  })
  title: string;

  @ApiProperty({
    type: String,
    example: `Node.js ning ilg'or kontseptsiyalari`,
    description: 'Kurs tavsifi',
    required: false,
  })
  description?: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-09-01T00:00:00Z',
    description: 'Kurs boshlanish sanasi',
  })
  startDate: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-12-31T23:59:59Z',
    description: 'Kurs tugash sanasi',
  })
  endDate: string;

  @ApiProperty({
    type: UserResponseDto,
    description: `O'qituvchi ma'lumotlari`,
  })
  teacher: UserResponseDto;

  @ApiProperty({
    type: [UserResponseDto],
    description: `Kursdagi studentlar ro'yxati`,
  })
  students: UserResponseDto[];

  @ApiProperty({
    type: Date,
    example: '2023-08-15T10:00:00Z',
    description: 'Yaratilgan vaqt',
  })
  createdAt: string;

  @ApiProperty({
    type: Date,
    example: '2023-08-15T10:05:00Z',
    description: 'Yangilangan vaqt',
  })
  updatedAt: string;
}