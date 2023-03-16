import { IsString, IsOptional } from 'class-validator'
import { ERROR_MESSAGES } from '../../constants/errors'
import { TypeStatusEnum } from '../interfaces/task-status'

export class FilterDto {
  @IsOptional()
  @IsString({ message: ERROR_MESSAGES.isString })
  readonly statusId?: TypeStatusEnum

  @IsOptional()
  @IsString({ message: ERROR_MESSAGES.isString })
  readonly search?: string
}
