import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Course, CourseSchema } from '../course/schemas/course.schema';
import { Task, TaskSchema } from '../task/schemas/task.schema';
import { SeedService } from './seeds.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}