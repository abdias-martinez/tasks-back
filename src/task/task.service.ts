import { ERROR_MESSAGES } from '../constants/errors'
import { Injectable } from '@nestjs/common'
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
    if (await this.isTaskAlreadyInDB(code)) {
      let message = ERROR_MESSAGES.isDuplicated.replace('$table', 'tarea')
      message = message.replace('$property', 'code')
      message = message.replace('$value', code)

      return { ok: false, response: [message] }
    }

    const response = await this.taskModel.create(task)
    return { ok: true, response }
  }

  private async isTaskAlreadyInDB(code: string): Promise<{ _id: string }> {
    return await this.taskModel.exists({ code })
  }
}
