import { MongooseModule } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { MongoHelper } from '../../test/mongo-helper'
import { Task, TaskSchema } from './entities/task.entity'
import { IFakeDbConnection } from './interfaces/fake-db-connection'
import { TaskService } from './task.service'

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
})
