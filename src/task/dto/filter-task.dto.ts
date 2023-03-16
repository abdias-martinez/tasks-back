import { IsString, IsOptional, IsEnum } from 'class-validator'
import { ERROR_MESSAGES } from '../../constants/errors'
import { TypeStatusEnum } from '../interfaces/task-status'

export class FilterDto {
  @IsOptional()
  @IsEnum(TypeStatusEnum, { message: ERROR_MESSAGES.isEnum })
  readonly statusId?: TypeStatusEnum

  @IsOptional()
  @IsString({ message: ERROR_MESSAGES.isString })
  readonly search?: string
}
