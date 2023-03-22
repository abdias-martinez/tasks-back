import { Body, Controller, Get, Post, Param } from '@nestjs/common'
import { TaskService } from './task.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { Query } from '@nestjs/common/decorators'
import { FilterDto } from './dto/filter-task.dto'
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe'
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

  @Get(':id')
  geTaskById(@Param('id', ParseMongoIdPipe) id: string) {
    return this.taskService.geTaskById(id)
  }

  @Post()
  async create(@Body() task: CreateTaskDto) {
    return this.taskService.create(task)
  }
}
