import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator'
import { ERROR_MESSAGES } from '../../constants/errors'

export class FilterDto {
  @IsOptional()
  @IsPositive({ message: ERROR_MESSAGES.isPositive })
  @IsNumber({}, { message: ERROR_MESSAGES.isNumber })
  readonly statusId?: number

  @IsOptional()
  @IsString({ message: ERROR_MESSAGES.isString })
  readonly search?: string
}
