import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '../enums/role.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] })
  assignedTasks?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }] })
  teachingCourses?: Types.ObjectId[]; // Teacher uchun

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Course' }], default: [] })
  enrolledCourses?: Types.ObjectId[]; // Student uchun
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
