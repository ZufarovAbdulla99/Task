import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../user/enums/role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async onModuleInit() {
    const userCount = await this.userModel.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial users...');

      const admin = new this.userModel({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: await bcrypt.hash('admin123', 10),
        role: UserRole.Admin,
      });

      const teacher = new this.userModel({
        name: 'Teacher',
        email: 'teacher@gmail.com',
        password: await bcrypt.hash('teacher123', 10),
        role: UserRole.Teacher,
      });

      await this.userModel.insertMany([admin, teacher]);

      console.log('Seeding complete');
    } else {
      console.log('Users already exist. Skipping seed.');
    }
  }
}