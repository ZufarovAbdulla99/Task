import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { Protected } from '../../decorators/protected.decorator';
import { Roles } from '../../decorators/role.decorator';
import { UserRole } from '../user/enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { RequestInterface } from 'src/guards/check-auth.guard';

@ApiTags('Course')
@ApiBearerAuth('JWT-auth')
@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
  ) {}

  @Post()
  @Protected()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Yangi kurs yaratish (Admin uchun)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Kurs muvaffaqiyatli yaratildi',
    type: CourseResponseDto,
  })
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @Req() req: RequestInterface,
  ) {
    const userId = req['userId'];
    return this.courseService.create(createCourseDto, userId);
  }

  @Get()
  @Protected()
  @ApiOperation({ summary: 'Barcha kurslarni olish' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Kurslar ro'yxati",
    type: [CourseResponseDto],
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.courseService.findAll({ page, limit });
  }

  @Get(':id')
  @Protected()
  @ApiOperation({ summary: "Kursni ID bo'yicha olish" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Kurs ma'lumotlari",
    type: CourseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Kurs topilmadi',
  })
  async findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @Protected()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Kursni yangilash (Admin uchun)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Kurs muvaffaqiyatli yangilandi',
    type: CourseResponseDto,
  })
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(id, dto);
  }

  @Delete(':id')
  @Protected()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: "Kursni o'chirish (Admin uchun)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Kurs muvaffaqiyatli o'chirildi",
  })
  async remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }

  @Post('register')
  @Protected()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: "Studentni kursga qo'shish (Admin uchun)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Student muvaffaqiyatli qo'shildi",
    type: CourseResponseDto,
  })
  async registerStudent(@Body() dto: RegisterStudentDto) {
    return this.courseService.registerStudent(dto);
  }

  @Get('teacher/:teacherId')
  @Protected()
  @ApiOperation({ summary: "O'qituvchining kurslarini olish" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "O'qituvchi kurslari",
    type: [CourseResponseDto],
  })
  async getTeacherCourses(
    @Param('teacherId') teacherId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.courseService.getTeacherCourses(teacherId, { page, limit });
  }
}
