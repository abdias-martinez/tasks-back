import { Body, Controller, Get, Post } from '@nestjs/common'
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
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto)
  }
}
