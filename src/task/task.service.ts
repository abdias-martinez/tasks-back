import { Injectable } from '@nestjs/common'
import { TASK_STATUS } from '../constants/status'

@Injectable()
export class TaskService {
  findStatus() {
    return TASK_STATUS
  }
}
