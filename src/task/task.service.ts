import { ERROR_MESSAGES } from '../constants/errors'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Task } from './entities/task.entity'
import { CreateTaskDto } from './dto/create-task.dto'
import { TASK_STATUS } from '../constants/status'
import { FilterDto } from './dto/filter-task.dto'
import { TaskDto } from './dto/task.dto'
import { TypeStatusEnum } from './interfaces/task-status'
import { UpdateTaskDTO } from './dto/update-task.dto'
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
    await this.validateIfTaskAlreadyInDB(code)

    return await this.taskModel.create(task)
  }

  async getAll(filter: FilterDto) {
    const { statusId, search = '' } = filter

    const tasks = await this.taskModel
      .find({
        // eslint-disable-next-line no-extra-parens
        ...(statusId && { statusId }),
        $or: [
          { taskName: { $regex: search, $options: 'i' } },
          { taskDescription: { $regex: search, $options: 'i' } },
        ],
      })
      .exec()
    const count = tasks.length
    const newTasks = tasks.map((task) => new TaskDto(task))
    return { count, task: newTasks }
  }

  async getTaskById(id: string) {
    const task = await this.hasTaskById(id)

    return new TaskDto(task, true)
  }

  async updateTaskStatusById(id: string, { statusId }: UpdateTaskDTO) {
    const task = await this.hasTaskById(id)

    if (task.statusId === TypeStatusEnum.FINISHED) {
      throw new BadRequestException([ERROR_MESSAGES.isStatusComplete])
    }

    task.statusId = statusId
    await task.save()

    return new TaskDto(task, true)
  }

  private async validateIfTaskAlreadyInDB(code: string): Promise<void> {
    const response = await this.taskModel.exists({ code })
    if (response) {
      const message = ERROR_MESSAGES.isDuplicated
        .replace('$property', 'code')
        .replace('$value', code)

      throw new BadRequestException([message])
    }
  }

  private async hasTaskById(id: string) {
    const response = await this.taskModel.findById({ _id: id })
    if (!response) {
      const message = ERROR_MESSAGES.isNotExistsDB.replace('$value', id)
      throw new BadRequestException([message])
    }

    return response
  }
}
