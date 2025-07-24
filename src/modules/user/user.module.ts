import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { OwnerGuard } from 'src/guards/is-owner.guard';
import { MeController } from './me.controller';
import { MeService } from './me.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController, MeController],
  providers: [UserService, OwnerGuard, MeService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}