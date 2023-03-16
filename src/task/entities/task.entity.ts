import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { TypeStatusEnum } from '../interfaces/task-status'
@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({
    index: true,
    required: true,
  })
  taskName: string

  @Prop({
    index: true,
    required: true,
  })
  taskDescription: string

  @Prop({
    unique: true,
    index: true,
    required: true,
  })
  code: string

  @Prop({
    index: true,
    required: true,
    default: '11111',
    enum: ['11111', '22222', '33333'],
  })
  statusId: TypeStatusEnum

  updatedAt: Date
}

export const TaskSchema = SchemaFactory.createForClass(Task)
