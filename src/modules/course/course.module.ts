import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Course, CourseSchema } from './schemas/course.schema';
import { OwnerGuard } from '../../guards/is-owner.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
    ]),
    UserModule,
  ],
  controllers: [CourseController],
  providers: [CourseService, OwnerGuard],
  exports: [CourseService],
})
export class CourseModule {}
