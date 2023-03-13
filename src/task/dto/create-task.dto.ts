import { IsNotEmpty, IsString } from 'class-validator'
import { ERROR_MESSAGES } from '../../constants/errores'
export class CreateTaskDto {
  @IsNotEmpty({ message: ERROR_MESSAGES.IsNotEmpty })
  @IsString({ message: ERROR_MESSAGES.isString })
  readonly taskName: string

  @IsNotEmpty({ message: ERROR_MESSAGES.IsNotEmpty })
  @IsString({ message: ERROR_MESSAGES.isString })
  readonly taskDescription: string

  @IsNotEmpty({ message: ERROR_MESSAGES.IsNotEmpty })
  @IsString({ message: ERROR_MESSAGES.isString })
  readonly code: string
}
