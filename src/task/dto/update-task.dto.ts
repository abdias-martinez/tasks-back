import { PartialType } from '@nestjs/mapped-types'
import { CreateTaskDto } from './create-task.dto'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { TypeStatusEnum } from '../interfaces/task-status'
import { ERROR_MESSAGES } from '../../constants/errors'

export class UpdateTaskDTO extends PartialType(CreateTaskDto) {
  @IsNotEmpty({ message: ERROR_MESSAGES.isNotEmpty })
  @IsEnum(TypeStatusEnum, { message: ERROR_MESSAGES.isEnum })
  readonly statusId: TypeStatusEnum
}
