import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
} from '@nestjs/common'
import { TaskService } from './task.service'
import { CreateTaskDto } from './dto/create-task.dto'
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('status')
  findStatus() {
    return this.taskService.findStatus()
  }

  @Post()
  async create(@Body() task: CreateTaskDto) {
    const { ok, response } = await this.taskService.create(task)
    if (!ok) {
      throw new BadRequestException(response)
    }

    return response
  }
}
