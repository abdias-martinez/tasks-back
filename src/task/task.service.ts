import { ERROR_MESSAGES } from '../constants/errors'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Task } from './entities/task.entity'
import { CreateTaskDto } from './dto/create-task.dto'
import { TASK_STATUS } from '../constants/status'
@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
  ) {}

  findStatus() {
    return TASK_STATUS
  }

  async create(task: CreateTaskDto) {
    const { code } = task
    await this.isTaskAlreadyInDB(code)

    return await this.taskModel.create(task)
  }

  async getAll() {
    const [count, tasks] = await Promise.all([
      this.taskModel.countDocuments(),
      this.taskModel.find().select('-__v').select('-createdAt').lean(),
    ])

    const newTasks = tasks.map(({ _id, updatedAt, statusId, ...rest }) => ({
      id: _id,
      ...rest,
      status: TASK_STATUS.find((status) => status.name === statusId),
      updatedAt: this.formatDateTime(new Date(updatedAt)),
    }))

    return { count, task: newTasks }
  }

  private async isTaskAlreadyInDB(code: string): Promise<void> {
    const response = await this.taskModel.exists({ code })
    if (response) {
      let message = ERROR_MESSAGES.isDuplicated.replace('$property', 'code')
      message = message.replace('$value', code)

      throw new BadRequestException([message])
    }
  }

  private formatDateTime = (date: Date): string => {
    const locale = 'es-419-u-hc-h12'
    const newDate = date ? new Date(date) : new Date()
    const dateTime = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    const formattedDateTime = dateTime.format(newDate)
    return formattedDateTime
  }
}
