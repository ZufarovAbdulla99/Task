import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Protected } from 'src/decorators/protected.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from './enums/role.enum';
import { IsOwner } from 'src/decorators/is-owner.decorator';
import { IsOwnerGuard } from 'src/guards/is-owner.guard';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id/courses')
  @Protected(true)
  @Roles([UserRole.Student])
  @IsOwner(true)
  @UseGuards(IsOwnerGuard)
  @ApiOperation({ summary: 'Get all courses for a student' })
  @ApiResponse({ status: 200, description: 'Courses returned successfully' })
  async getStudentCourses(@Param('id') id: string) {
    return this.userService.getUserCourses(id);
  }
}
