import { Body, Controller, Get, Post, Param, Patch } from '@nestjs/common'
import { TaskService } from './task.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { Query } from '@nestjs/common/decorators'
import { FilterDto } from './dto/filter-task.dto'
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe'
import { UpdateTaskDTO } from './dto/update-task.dto'
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
  getTaskById(@Param('id', ParseMongoIdPipe) id: string) {
    return this.taskService.getTaskById(id)
  }

  @Post()
  async create(@Body() task: CreateTaskDto) {
    return this.taskService.create(task)
  }

  @Patch(':id')
  updateTaskStatusById(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateStatusIdDto: UpdateTaskDTO,
  ) {
    return this.taskService.updateTaskStatusById(id, updateStatusIdDto)
  }
}
