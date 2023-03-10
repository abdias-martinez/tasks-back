import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Task } from './entities/task.entity'

import { taskStatus } from '../constants/status'

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
  ) {}

  findAll() {
    return this.taskModel.find()
  }

  findStatus() {
    return taskStatus
  }
}
