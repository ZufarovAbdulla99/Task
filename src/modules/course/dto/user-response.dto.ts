import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/modules/user/enums/role.enum';

export class UserResponseDto {
  @ApiProperty({
    type: String,
    example: '507f1f77bcf86cd799439016',
    description: 'Foydalanuvchi IDsi',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'John Doe',
    description: 'Foydalanuvchi ismi',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
    description: 'Foydalanuvchi emaili',
  })
  email: string;

  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
    example: UserRole.Teacher,
    description: 'Foydalanuvchi roli',
  })
  role: UserRole;
}