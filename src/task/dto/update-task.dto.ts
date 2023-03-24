import { TypeStatusEnum } from '../interfaces/task-status'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { ERROR_MESSAGES } from '../../constants/errors'

export class UpdateTaskDTO {
  @IsNotEmpty({ message: ERROR_MESSAGES.isNotEmpty })
  @IsEnum(TypeStatusEnum, { message: ERROR_MESSAGES.isEnum })
  readonly statusId: TypeStatusEnum
}
