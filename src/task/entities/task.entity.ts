import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { TypeStatusEnum } from '../interfaces/task-status'

export type TaskDocument = Task & Document

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({
    required: true,
  })
  taskName: string

  @Prop({
    required: true,
  })
  taskDescription: string

  @Prop({
    unique: true,
    required: true,
  })
  code: string

  @Prop({
    type: String,
    required: true,
    default: TypeStatusEnum.CREATE,
    enum: TypeStatusEnum,
  })
  statusId: TypeStatusEnum

  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date
}

export const TaskSchema = SchemaFactory.createForClass(Task)
