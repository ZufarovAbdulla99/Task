import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    try {
      return await this.taskModel.create({
        ...createTaskDto,
        createdBy: userId,
      });
    } catch (err) {
      throw err;
    }
  }

  async findAll(options?: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;

    return this.taskModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate('createdBy')
      .exec();
  }

  async findByOwner(
    userId: string,
    options?: { page?: number; limit?: number },
  ) {
    const { page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;

    return this.taskModel
      .find({ createdBy: userId })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findAssignedTo(
    userId: string,
    options?: { page?: number; limit?: number },
  ) {
    const { page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;

    return this.taskModel
      .find({ assignedTo: userId })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<Task> {
    try {
      return await this.taskModel.findById(id).populate('createdBy').exec();
    } catch (err) {
      throw err;
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      return await this.taskModel
        .findByIdAndUpdate(id, updateTaskDto, { new: true })
        .exec();
    } catch (err) {
      throw err;
    }
  }

  async remove(id: string): Promise<Task> {
    try {
      return await this.taskModel.findByIdAndDelete(id).exec();
    } catch (err) {
      throw err;
    }
  }

  async updateByOwner(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.taskModel
      .findOneAndUpdate({ _id: id, createdBy: userId }, updateTaskDto, {
        new: true,
      })
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found or you are not the owner');
    }
    return task;
  }

  async removeByOwner(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel
      .findOneAndDelete({
        _id: id,
        createdBy: userId,
      })
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found or you are not the owner');
    }
    return task;
  }
}
