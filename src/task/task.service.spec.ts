import { MongooseModule } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { MongoHelper } from '../../test/mongo-helper'
import { Task, TaskSchema } from './entities/task.entity'
import { TaskService } from './task.service'
import { BadRequestException } from '@nestjs/common'
import { TypeStatusEnum } from './interfaces/task-status'

describe('TaskService', () => {
  let taskService: TaskService
  const mongoServer = MongoHelper.createServer()

  beforeAll(async () => {
    const path = `${__dirname}\\fixtures`
    const mongoUri = await MongoHelper.setup(path, await mongoServer)

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
      ],
      providers: [TaskService],
    }).compile()

    taskService = module.get<TaskService>(TaskService)
  })

  afterAll(async () => {
    await MongoHelper.stop(await mongoServer)
  })

  it('should be defined', () => {
    expect(taskService).toBeDefined()
  })

  describe('When the findStatus method is called', () => {
    it('should return all the status', () => {
      const taskStatus = [
        {
          id: 1,
          name: 'Creada',
        },
        {
          id: 2,
          name: 'En proceso',
        },
        {
          id: 3,
          name: 'Terminada',
        },
      ]

      const response = taskService.findStatus()

      expect(response).toEqual(taskStatus)
    })
  })

  describe('When the create method is called', () => {
    const taskToCreate = {
      taskName: 'Task 1',
      taskDescription: 'Task 1 description',
      code: 'T1',
    }

    it('should create a new task, save it to the DB and return it', async () => {
      const response = await taskService.create(taskToCreate)

      expect(response).toEqual(
        expect.objectContaining({
          ...taskToCreate,
          statusId: TypeStatusEnum.CREATE,
          updatedAt: expect.any(Date),
          createdAt: expect.any(Date),
        }),
      )
    })

    it('should give an error when there is code duplication', async () => {
      await expect(taskService.create(taskToCreate)).rejects.toThrow(
        BadRequestException,
      )
    })

    it('should give an message error when there is code duplication', async () => {
      await expect(taskService.create(taskToCreate)).rejects.toThrow(
        new BadRequestException(['El registro code: T1 ya existe en la DB']),
      )
    })

    it('should return error if code is empty', async () => {
      const taskToCreateWithNoCode = {
        taskName: 'Task 1',
        taskDescription: 'Task 1 description',
        code: '',
      }

      await expect(taskService.create(taskToCreateWithNoCode)).rejects.toThrow()
    })

    it('should return a list of errors if the taskName, taskDescription and code are empty', async () => {
      const taskToCreateWithNoCode = {
        taskName: '',
        taskDescription: '',
        code: '',
      }

      await expect(taskService.create(taskToCreateWithNoCode)).rejects.toThrow()
    })
  })

  describe('When the get method is called', () => {
    it('should return the amount and list of tasks', async () => {
      const response = await taskService.getAll()
      expect(response).toMatchObject({
        count: expect.any(Number),
        task: expect.any(Array),
      })
    })

    it('Returns the list of tasks with the values', async () => {
      const response = await taskService.getAll()

      expect(response.task[0]).toMatchObject({
        id: expect.any(Object),
        code: expect.any(String),
        status: {
          id: expect.any(Number),
          name: expect.any(String),
        },
        taskName: expect.any(String),
        taskDescription: expect.any(String),
        updatedAt: expect.any(String),
      })
    })
  })
})
