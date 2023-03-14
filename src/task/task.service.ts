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

  private async isTaskAlreadyInDB(code: string): Promise<void> {
    const response = await this.taskModel.exists({ code })
    if (response) {
      let message = ERROR_MESSAGES.isDuplicated.replace('$property', 'code')
      message = message.replace('$value', code)

      throw new BadRequestException([message])
    }
  }
}
