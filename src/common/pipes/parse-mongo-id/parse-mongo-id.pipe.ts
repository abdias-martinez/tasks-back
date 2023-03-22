import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common'
import { isValidObjectId } from 'mongoose'
import { ERROR_MESSAGES } from '../../../constants/errors'

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string) {
    if (!isValidObjectId(value)) {
      const message = ERROR_MESSAGES.isNotExistsDB.replace('$value', value)
      throw new BadRequestException([message])
    }
    return value
  }
}
