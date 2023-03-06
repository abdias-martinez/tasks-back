import { Injectable } from '@nestjs/common'
import { status } from '../constants/status'
import { IStatus } from './interfaces/status'

@Injectable()
export class StatusService {
  getAll(): IStatus[] {
    return status
  }
}
