import { IsString, IsOptional } from 'class-validator'
import { ERROR_MESSAGES } from '../../constants/errors'

export class CreateTaskDto {
  @IsOptional()
  @IsString({ message: ERROR_MESSAGES.isString })
  readonly statusId?: string

  @IsOptional()
  @IsString({ message: ERROR_MESSAGES.isString })
  readonly search?: string
}
