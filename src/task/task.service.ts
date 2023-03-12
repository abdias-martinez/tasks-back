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
    const errors = this.validateTask(task)
    if (errors.length) return errors

    if (await this.isTaskAlreadyInDB(code)) {
      return [`La tarea con el código ${code} ya existe en la base de datos`]
    }

    return await this.taskModel.create(task)
  }

  async getAll() {
    return await this.taskModel.find()
  }

  validateTask(task: CreateTaskDto): string[] {
    const errors = []
    for (const property in task) {
      const value = task[property]
      if (!value) errors.push(`El campo ${property} es requerido`)
    }

    return errors
  }

  private async isTaskAlreadyInDB(code: string): Promise<{ _id: string }> {
    return await this.taskModel.exists({ code })
  }
}
