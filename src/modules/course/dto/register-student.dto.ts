import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterStudentDto {
  @ApiProperty({
    description: 'Student ning MongoDB ObjectId si',
    example: '64abc123def456789012345a',
  })
  @IsNotEmpty({ message: "Student ID bo'sh bo'lishi mumkin emas" })
  @IsString({ message: "Student ID string bo'lishi kerak" })
  @IsMongoId({
    message: "Student ID to'g'ri MongoDB ObjectId formatida bo'lishi kerak",
  })
  studentId: string;

  @ApiProperty({
    description: 'Kurs ning MongoDB ObjectId si',
    example: '64abc123def456789012345b',
  })
  @IsNotEmpty({ message: "Course ID bo'sh bo'lishi mumkin emas" })
  @IsString({ message: "Course ID string bo'lishi kerak" })
  @IsMongoId({
    message: "Course ID to'g'ri MongoDB ObjectId formatida bo'lishi kerak",
  })
  courseId: string;
}