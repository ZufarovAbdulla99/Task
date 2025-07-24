import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class MeService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findMe(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .populate('assignedTasks', 'title description status dueDate')
      .populate('teachingCourses', 'title description startDate endDate')
      .populate('enrolledCourses', 'title description startDate endDate')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    const updated = await this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .select('-password')
      .populate('assignedTasks', 'title description status dueDate')
      .populate('teachingCourses', 'title description startDate endDate')
      .populate('enrolledCourses', 'title description startDate endDate')
      .exec();

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return updated;
  }
}
