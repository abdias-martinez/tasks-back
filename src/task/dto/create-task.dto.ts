import { IsNotEmpty } from 'class-validator'
import { ERROR_MESSAGES } from '../../constants/errores'
export class CreateTaskDto {
  @IsNotEmpty({ message: ERROR_MESSAGES.IsNotEmpty })
  readonly taskName: string

  @IsNotEmpty({ message: ERROR_MESSAGES.IsNotEmpty })
  readonly taskDescription: string

  @IsNotEmpty({ message: ERROR_MESSAGES.IsNotEmpty })
  readonly code: string
}
