import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly taskName: string

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly taskDescription: string

  @IsString()
  @IsNotEmpty()
  readonly code: string
}
