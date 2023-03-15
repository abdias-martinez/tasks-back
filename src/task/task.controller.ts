import { Body, Controller, Get, Post } from '@nestjs/common'
import { TaskService } from './task.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { Query } from '@nestjs/common/decorators'
import { FilterDto } from './dto/filter-task.dto'
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('status')
  findStatus() {
    return this.taskService.findStatus()
  }

  @Get()
  getAll(@Query() filterDTO: FilterDto) {
    return this.taskService.getAll(filterDTO)
  }

  @Post()
  async create(@Body() task: CreateTaskDto) {
    return this.taskService.create(task)
  }
}
