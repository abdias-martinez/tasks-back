import { MongooseModule } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { MongoHelper } from '../../test/mongo-helper'
import { Task, TaskSchema } from './entities/task.entity'
import { IFakeDbConnection } from './interfaces/fake-db-connection'
import { TypeStatusEnum } from './interfaces/task-status'
import { TaskService } from './task.service'
import { BadRequestException } from '@nestjs/common'

describe('TaskService', () => {
  let taskService: TaskService
  let fakeDbConnection: IFakeDbConnection

  beforeAll(async () => {
    fakeDbConnection = await MongoHelper.startFakeDbConnection()
    const { mongoUri } = fakeDbConnection
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri, { useNewUrlParser: true }),
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
      ],
      providers: [TaskService],
    }).compile()

    taskService = module.get<TaskService>(TaskService)
  })

  afterAll(async () => {
    await MongoHelper.stopFakeDbConnection(fakeDbConnection)
  })

  it('should be defined', () => {
    expect(taskService).toBeDefined()
  })

  describe('When the findStatus method is called', () => {
    it('should return all the status', () => {
      const taskStatus = [
        {
          statusId: 1,
          statusName: 'Creada',
        },
        {
          statusId: 2,
          statusName: 'En proceso',
        },
        {
          statusId: 3,
          statusName: 'Terminada',
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
})
