import { formatDateTime } from '../../utils/date/date-utils'
import { TASK_STATUS } from '../../constants/status'

interface Task {
  _id: string
  updatedAt: Date
  taskName: string
  taskDescription: string
  statusId: number
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
  }
}
