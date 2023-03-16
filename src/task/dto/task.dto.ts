import { BadRequestException } from '@nestjs/common'
import { formatDateTime } from '../../utils/date/date-utils'
import { TASK_STATUS } from '../../constants/status'
import { ERROR_MESSAGES } from '../../constants/errors'
import { TypeStatusEnum } from '../interfaces/task-status'

interface Task {
  _id: string
  updatedAt: Date
  taskName: string
  taskDescription: string
  statusId: TypeStatusEnum
  code: string
}

export class TaskDto {
  id: string
  updatedAt: string
  taskName: string
  taskDescription: string
  code: string
  status: object

  constructor(task: Task) {
    this.id = task['_id']
    this.updatedAt = formatDateTime(task.updatedAt)
    this.taskName = task.taskName
    this.taskDescription = task.taskDescription
    this.code = task.code
    this.status = TASK_STATUS.find((status) => status.id === task.statusId)
    if (!this.status) {
      throw new BadRequestException([
        ERROR_MESSAGES.isNotExists
          .replace('$property', 'statusId')
          .replace('$value', task.statusId.toString()),
      ])
    }
  }
}
