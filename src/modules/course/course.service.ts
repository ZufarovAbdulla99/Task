import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { UserRole } from '../user/enums/role.enum';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    dto: CreateCourseDto,
    createdBy: string,
  ): Promise<CourseResponseDto> {
    try {
      // 1. O'qituvchini tekshirish
      const teacher: UserDocument = await this.validateUser(
        dto.teacher,
        UserRole.Teacher,
      );

      // 2. Kurs yaratish
      const newCourse = new this.courseModel({
        title: dto.title,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        teacher: teacher._id,
        createdBy: new Types.ObjectId(createdBy), // required maydonni to'ldirish
        students: [], // boshlang'ich qiymat
      });

      const savedCourse = await newCourse.save();

      // 3. O'qituvchiga kursni qo'shish
      await this.userModel.findByIdAndUpdate(teacher._id, {
        $addToSet: { teachingCourses: savedCourse._id },
      });

      return this.toCourseResponseDto(savedCourse);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll({ page = 1, limit = 10 }): Promise<CourseResponseDto[]> {
    try {
      const skip = (page - 1) * limit;
      const courses = await this.courseModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate('teacher')
        .populate('students')
        .exec();

      return courses.map((course) => this.toCourseResponseDto(course));
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string): Promise<CourseResponseDto> {
    try {
      this.validateId(id);
      const course = await this.courseModel
        .findById(id)
        .populate('teacher')
        .populate('students')
        .exec();

      if (!course) {
        throw new NotFoundException('Kurs topilmadi');
      }

      return this.toCourseResponseDto(course);
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, dto: UpdateCourseDto): Promise<CourseResponseDto> {
    try {
      this.validateId(id);

      if (dto.teacher) {
        await this.validateUser(dto.teacher, UserRole.Teacher);
      }

      const updatedCourse = await this.courseModel
        .findByIdAndUpdate(id, dto, { new: true })
        .populate('teacher')
        .populate('students')
        .exec();
      // console.log(updatedCourse);
      if (!updatedCourse) {
        throw new NotFoundException('Kurs topilmadi');
      }

      return this.toCourseResponseDto(updatedCourse);
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.validateId(id);
      const result = await this.courseModel.findByIdAndDelete(id).exec();

      if (!result) {
        throw new NotFoundException('Kurs topilmadi');
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async registerStudent(dto: RegisterStudentDto): Promise<CourseResponseDto> {
    try {
      console.log('=== Register Student Started ===');
      console.log('DTO:', dto);

      // 1. ID format tekshiruvi
      if (!Types.ObjectId.isValid(dto.studentId)) {
        throw new BadRequestException(`Noto'g'ri student ID: ${dto.studentId}`);
      }
      if (!Types.ObjectId.isValid(dto.courseId)) {
        throw new BadRequestException(`Noto'g'ri course ID: ${dto.courseId}`);
      }

      // 2. ObjectId larni yaratish
      const studentObjectId = new Types.ObjectId(dto.studentId);
      const courseObjectId = new Types.ObjectId(dto.courseId);

      // 3. Ma'lumotlarni topish
      console.log('Searching for student and course...');

      const student = await this.userModel.findById(studentObjectId).exec();
      console.log(
        'Student found:',
        student ? `${student.name} (${student.role})` : 'NULL',
      );

      const course = await this.courseModel.findById(courseObjectId).exec();
      console.log('Course found:', course ? course.title : 'NULL');

      // 4. Mavjudlik tekshiruvi
      if (!student) {
        // Debug ma'lumot
        const allUsers = await this.userModel
          .find()
          .select('_id name role')
          .exec();
        console.log('All users in DB:', allUsers);
        throw new NotFoundException(`Student topilmadi. ID: ${dto.studentId}`);
      }

      if (!course) {
        const allCourses = await this.courseModel
          .find()
          .select('_id title')
          .exec();
        console.log('All courses in DB:', allCourses);
        throw new NotFoundException(`Kurs topilmadi. ID: ${dto.courseId}`);
      }

      // 5. Role tekshiruvi
      if (student.role !== UserRole.Student) {
        throw new BadRequestException(
          `Foydalanuvchi student emas: ${student.role}`,
        );
      }

      // 6. Takroriy qo'shishni tekshirish
      const isEnrolled = course.students.some(
        (id) => id.toString() === studentObjectId.toString(),
      );

      if (isEnrolled) {
        console.log('Student already enrolled, returning current state');
        throw new BadRequestException('Bu student allaqachon kursga yozilgan')
      }

      // 7. Qo'shish jarayoni
      console.log('Adding student to course...');

      // Course ga student qo'shish
      course.students.push(studentObjectId);
      await course.save();
      console.log('Student added to course');

      // Student ga course qo'shish
      if (!student.enrolledCourses) {
        student.enrolledCourses = [];
      }
      student.enrolledCourses.push(courseObjectId);
      await student.save();
      console.log('Course added to student');

      // 8. Natijani qaytarish
      const result = await this.getCourseWithPopulate(dto.courseId);
      console.log('=== Register Student Completed ===');
      return result;
    } catch (error) {
      console.error('=== Register Student Error ===');
      console.error('Error name:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('DTO:', dto);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(`Server xatosi: ${error.message}`);
    }
  }

  // Yordamchi metod
  private async getCourseWithPopulate(
    courseId: string,
  ): Promise<CourseResponseDto> {
    const course = await this.courseModel
      .findById(courseId)
      .populate('teacher', 'name email role')
      .populate('students', 'name email role')
      .exec();

    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }

    return this.toCourseResponseDto(course);
  }

  async getTeacherCourses(
    teacherId: string,
    { page = 1, limit = 10 }: { page?: number; limit?: number },
  ): Promise<CourseResponseDto[]> {
    try {
      this.validateId(teacherId);
      page = Math.max(1, page);
      limit = Math.max(1, Math.min(100, limit));
      const skip = (page - 1) * limit;

      const courses = await this.courseModel
        .find({ teacher: new Types.ObjectId(teacherId) })
        .skip(skip)
        .limit(limit)
        .populate<{ teacher: UserDocument }>('teacher')
        .populate<{ students: UserDocument[] }>('students')
        .lean()
        .exec();

      if (!courses || courses.length === 0) {
        throw new NotFoundException('Ustozning kurslari topilmadi');
      }

      return courses.map((course) => ({
        id: course._id.toString(),
        title: course.title,
        description: course.description,
        startDate: course.startDate.toISOString(),
        endDate: course.endDate.toISOString(),
        teacher: course.teacher ? this.toUserDto(course.teacher) : null,
        students: course.students
          ? course.students.map((student) => this.toUserDto(student))
          : [],
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
      }));
    } catch (error) {
      console.error('Get teacher courses error:', error);
      this.handleError(error);
      throw error;
    }
  }

  private async validateUser(
    userId: string,
    role: UserRole,
  ): Promise<UserDocument> {
    this.validateId(userId);

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (user.role !== role) {
      throw new BadRequestException(`Foydalanuvchi ${role} roliga ega emas`);
    }

    return user;
  }

  private validateId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Noto'g'ri ID formati");
    }
  }

  private toCourseResponseDto(
    course: CourseDocument & {
      teacher: UserDocument | Types.ObjectId;
      students: UserDocument[] | Types.ObjectId[];
    },
  ): CourseResponseDto {
    return {
      id: course._id.toString(),
      title: course.title,
      description: course.description,
      startDate: course.startDate.toISOString(),
      endDate: course.endDate.toISOString(),
      teacher: this.toUserDto(
        course.teacher instanceof Types.ObjectId ? null : course.teacher,
      ),
      students: Array.isArray(course.students)
        ? course.students
            .map((student) =>
              student instanceof Types.ObjectId
                ? null
                : this.toUserDto(student),
            )
            .filter(Boolean)
        : [],
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    };
  }

  private toUserDto(user: any): any {
    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  private handleError(error: any): never {
    // console.error(error);
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException
    ) {
      throw error;
    }
    throw new InternalServerErrorException('Server xatosi');
  }
}
