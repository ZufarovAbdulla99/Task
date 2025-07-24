import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task, TaskSchema } from './schemas/task.schema';
import { OwnerGuard } from 'src/guards/is-owner.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TaskController],
  providers: [TaskService, OwnerGuard],
  exports: [MongooseModule, TaskService]
})
export class TaskModule {}