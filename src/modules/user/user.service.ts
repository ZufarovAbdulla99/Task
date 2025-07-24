import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto, role: UserRole) {
    try {
      const newUser = new this.userModel({ ...createUserDto, role });
      return await newUser.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll() {
    try {
      return await this.userModel.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findOne(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid user ID');
      }

      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      throw new InternalServerErrorException('Failed to find user by email');
    }
  }

  async getUserCourses(id: string) {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const fieldToPopulate =
      user.role === UserRole.Teacher ? 'teachingCourses' : 'enrolledCourses';

    const populatedUser = await this.userModel
      .findById(id)
      .populate(fieldToPopulate);

    return populatedUser[fieldToPopulate];
  } catch (error) {
    throw error;
  }
}


  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid user ID');
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { new: true },
      );

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid user ID');
      }

      const deletedUser = await this.userModel.findByIdAndDelete(id);

      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }

      return { message: 'User deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async addTeachingCourse(userId: string, courseId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { teachingCourses: courseId } },
      { new: true },
    );
  }

  async addEnrolledCourse(userId: string, courseId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true },
    );
  }
}
