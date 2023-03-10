import { MongooseModule } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Task, TaskSchema } from './entities/task.entity'
import { TaskController } from './task.controller'
import { TaskService } from './task.service'
import { MongoHelper } from '../../test/mongo-helper'
import { IFakeDbConnection } from './interfaces/fake-db-connection'
import { INestApplication, HttpStatus } from '@nestjs/common'
import { AppModule } from '../app.module'
import * as request from 'supertest'

describe('TaskController', () => {
  let taskController: TaskController
  let mongod: IFakeDbConnection
  let app: INestApplication

  beforeAll(async () => {
    mongod = await MongoHelper.startFakeDbConnection()
    const { mongoUri } = mongod

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
      ],
      controllers: [TaskController],
      providers: [TaskService],
    }).compile()

    app = module.createNestApplication()
    await app.init()
    taskController = module.get<TaskController>(TaskController)
  })

  afterAll(async () => {
    await app.close()
    await MongoHelper.stopFakeDbConnection(mongod)
  })

  it('should be defined', () => {
    expect(taskController).toBeDefined()
  })

  describe('GET /task/status', () => {
    it('get the list of status', async () => {
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
      const response = await request(app.getHttpServer())
        .get('/task/status')
        .expect(HttpStatus.OK)

      expect(response.body).toEqual(taskStatus)
    })
  })
})
