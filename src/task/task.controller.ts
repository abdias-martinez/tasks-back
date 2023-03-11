import { Body, Controller, Get, Post } from '@nestjs/common'
import { TaskService } from './task.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { ERROR_MESSAGES } from '../constants/errores'

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('status')
  findStatus() {
    return this.taskService.findStatus()
  }

  @Post()
  async create(@Body() task: CreateTaskDto) {
    const errors = this.validateType(task)

    if (errors.length) return errors

    return this.taskService.create(task)
  }

  validateType(task: CreateTaskDto): string[] {
    const errors = []
    for (const property in task) {
      const value = task[property]
      if (typeof value !== 'string') {
        const message = ERROR_MESSAGES.isString
        errors.push(message.replace('$property', property))
      }
    }

    return errors
  }
}
