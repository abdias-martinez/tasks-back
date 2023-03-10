import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { TypeStatusEnum } from '../interfaces/task-status'
import { ERROR_MESSAGES } from '../../constants/errores'
@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({
    index: true,
    required: [true, ERROR_MESSAGES.IsNotEmpty],
  })
  taskName: string

  @Prop({
    index: true,
    required: [true, ERROR_MESSAGES.IsNotEmpty],
  })
  taskDescription: string

  @Prop({
    unique: true,
    index: true,
    required: [true, ERROR_MESSAGES.IsNotEmpty],
  })
  code: string

  @Prop({
    index: true,
    required: true,
    default: 'Creada',
  })
  statusId: TypeStatusEnum
}

export const TaskSchema = SchemaFactory.createForClass(Task)
