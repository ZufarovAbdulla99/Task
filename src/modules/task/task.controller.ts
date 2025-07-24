import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Protected } from 'src/decorators/protected.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from '../user/enums/role.enum';
import { IsOwner } from 'src/decorators/is-owner.decorator';
import { Task } from './schemas/task.schema';
import { OwnerGuard } from 'src/guards/is-owner.guard';

@ApiTags('Task')
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Protected(true)
  @Roles(UserRole.Teacher, UserRole.Admin)
  @ApiOperation({ summary: 'Create a new task (student or teacher only)' })
  create(@Body() dto: CreateTaskDto, @Req() req: any) {
    // console.log('USER ID:', req.userId);
    return this.taskService.create(dto, req.userId);
  }

  @Get()
  @Protected(true)
  @ApiOperation({ summary: 'Get tasks by role with pagination' })
  async findAll(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { userId, role } = req;

    try {
      if (role === UserRole.Admin) {
        return this.taskService.findAll({ page, limit });
      } else if (role === UserRole.Teacher) {
        return this.taskService.findByOwner(userId, { page, limit });
      } else if (role === UserRole.Student) {
        return this.taskService.findAssignedTo(userId, { page, limit });
      }

      return [];
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch tasks');
    }
  }

  @Get(':id')
  @Protected(true)
  @UseGuards(OwnerGuard)
  @IsOwner(Task, 'createdBy')
  @ApiOperation({ summary: 'Get a task by ID (only if owner)' })
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @Protected(true)
  @Roles(UserRole.Admin, UserRole.Teacher)
  @UseGuards(OwnerGuard)
  @IsOwner(Task, 'createdBy')
  @ApiOperation({ summary: 'Update a task (only if owner)' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Req() req: any) {
    if (req.role === UserRole.Admin) {
      return this.taskService.update(id, dto);
    }

    return this.taskService.updateByOwner(id, dto, req.userId);
  }

  @Delete(':id')
  @Protected(true)
  @Roles(UserRole.Teacher, UserRole.Admin)
  @UseGuards(OwnerGuard)
  @IsOwner(Task, 'createdBy')
  @ApiOperation({ summary: 'Delete a task (only if owner)' })
  remove(@Param('id') id: string, @Req() req: any) {
    if (req.role === UserRole.Admin) {
      return this.taskService.remove(id);
    }
    return this.taskService.removeByOwner(id, req.userId);
  }
}
