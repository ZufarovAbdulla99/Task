import { Controller, Get, Patch, Body, Req } from '@nestjs/common';
import { Protected } from 'src/decorators/protected.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MeService } from './me.service';
import { RequestInterface } from 'src/guards/check-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMeDto } from './dto/update-me.dto';

@ApiTags('Me')
@ApiBearerAuth('JWT-auth')
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  @Protected()
  @ApiOperation({ summary: 'Get current logged in user' })
  getMe(@Req() req: RequestInterface) {
    console.log('Full request object keys:', Object.keys(req));
    console.log('Request userId:', req.userId);
    console.log('Request role:', req.role);

    if (!req.userId) {
      throw new Error('User ID not found in request');
    }

    return this.meService.findMe(req.userId);
  }

  @Patch()
  @Protected()
  @ApiOperation({ summary: 'Update current user profile' })
  updateMe(@Req() req: RequestInterface, @Body() dto: UpdateMeDto) {
    console.log('Update - Request userId:', req.userId);

    if (!req.userId) {
      throw new Error('User ID not found in request');
    }

    return this.meService.updateMe(req.userId, dto);
  }
}