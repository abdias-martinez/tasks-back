import { PartialType } from '@nestjs/mapped-types'
import { CreateTaskDto } from './create-task.dto'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { TypeStatusEnum } from '../interfaces/task-status'
import { ERROR_MESSAGES } from '../../constants/errors'

export class UpdateTaskDTO extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsEnum(TypeStatusEnum, { message: ERROR_MESSAGES.isEnum })
  readonly statusId?: TypeStatusEnum

  @IsOptional()
  @IsString({ message: ERROR_MESSAGES.isString })
  readonly taskName?: string

  @IsOptional()
  @IsString({ message: ERROR_MESSAGES.isString })
  readonly taskDescription?: string
}
