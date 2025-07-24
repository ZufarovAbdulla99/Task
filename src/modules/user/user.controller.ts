import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Protected } from 'src/decorators/protected.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from './enums/role.enum';
import { IsOwner } from 'src/decorators/is-owner.decorator';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Protected(true)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Get all users (admin only)' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Protected(true)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Get one user by ID (admin only)' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @Protected(true)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto, UserRole.Student); // Default role
  }

  @Patch(':id')
  @Protected(true)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Update a user by ID (admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @Protected(true)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Delete a user by ID (admin only)' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get(':id/courses')
  @Protected()
  @Roles(UserRole.Student)
  @IsOwner(User, '_id')
  @ApiOperation({ summary: 'Get all courses for a student' })
  @ApiResponse({ status: 200, description: 'Courses returned successfully' })
  async getStudentCourses(@Param('id') id: string) {
    return this.userService.getUserCourses(id);
  }
}