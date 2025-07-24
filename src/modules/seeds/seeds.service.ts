import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { Course } from '../course/schemas/course.schema';
import { Task } from '../task/schemas/task.schema';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../user/enums/role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async onModuleInit() {
    const [userCount, courseCount, taskCount] = await Promise.all([
      this.userModel.countDocuments(),
      this.courseModel.countDocuments(),
      this.taskModel.countDocuments(),
    ]);

    if (userCount > 0 || courseCount > 0 || taskCount > 0) {
      console.log('Seed skipped. Some collections already contain data.');
      return;
    }

    console.log('Seeding initial users, courses and tasks...');

    // 1. Create users
    const admin = await this.userModel.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.Admin,
    });

    const teacher1 = await this.userModel.create({
      name: 'Teacher One',
      email: 'teacher1@gmail.com',
      password: await bcrypt.hash('teacher123', 10),
      role: UserRole.Teacher,
    });

    const teacher2 = await this.userModel.create({
      name: 'Teacher Two',
      email: 'teacher2@gmail.com',
      password: await bcrypt.hash('teacher123', 10),
      role: UserRole.Teacher,
    });

    const student1 = await this.userModel.create({
      name: 'Student One',
      email: 'student1@gmail.com',
      password: await bcrypt.hash('student123', 10),
      role: UserRole.Student,
    });

    const student2 = await this.userModel.create({
      name: 'Student Two',
      email: 'student2@gmail.com',
      password: await bcrypt.hash('student123', 10),
      role: UserRole.Student,
    });

    // 2. Create courses (linked to teacher1 and teacher2)
    const course1 = await this.courseModel.create({
      title: 'NestJS',
      description: 'Learn NestJS Framework',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      teacher: teacher1._id,
      createdBy: teacher1._id,
      students: [student1._id, student2._id],
    });

    const course2 = await this.courseModel.create({
      title: 'MongoDB',
      description: 'Learn MongoDB',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      teacher: teacher2._id,
      createdBy: teacher2._id,
      students: [student1._id, student2._id],
    });

    // 3. Create tasks – each teacher creates 2 tasks (1 per student)
    await this.taskModel.create([
      {
        title: 'NestJS Task 1',
        description: 'Intro to NestJS',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'pending',
        createdBy: teacher1._id,
        course: course1._id,
        assignedTo: student1._id,
      },
      {
        title: 'NestJS Task 2',
        description: 'Controllers and Services',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'pending',
        createdBy: teacher1._id,
        course: course1._id,
        assignedTo: student2._id,
      },
      {
        title: 'MongoDB Task 1',
        description: 'Basic queries',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'pending',
        createdBy: teacher2._id,
        course: course2._id,
        assignedTo: student1._id,
      },
      {
        title: 'MongoDB Task 2',
        description: 'Aggregation pipelines',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'pending',
        createdBy: teacher2._id,
        course: course2._id,
        assignedTo: student2._id,
      },
    ]);

    console.log('Seeding complete ✅');
  }
}
