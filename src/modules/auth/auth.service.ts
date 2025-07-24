import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/modules/user/enums/role.enum';
import { RegisterDto } from './dto/register-dto';
import { LoginUserDto } from './dto/login-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(payload: {
    sub: string;
    email: string;
    role: string;
  }) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '24h',
    });

    return { accessToken };
  }

  async register(dto: RegisterDto) {
    try {
      const existing = await this.userService.findByEmail(dto.email);
      if (existing) {
        throw new BadRequestException('Email already registered');
      }

      const hashed = await bcrypt.hash(dto.password, 10);

      const user = await this.userService.create(
        {
          name: dto.name,
          email: dto.email,
          password: hashed,
        },
        UserRole.Student,
      );

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: 'Ro‘yxatdan o‘tish muvaffaqiyatli',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(dto: LoginUserDto) {
    try {
      const user = await this.userService.findByEmail(dto.email);

      if (!user) {
        throw new UnauthorizedException('Email yoki parol noto‘g‘ri');
      }

      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Email yoki parol noto‘g‘ri');
      }

      const tokens = this.generateToken({
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      return {
        ...tokens,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: 'Muvaffaqiyatli login qilindi',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}