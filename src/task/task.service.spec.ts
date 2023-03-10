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

  describe('When the create method is called', () => {
    const taskToCreate = {
      taskName: 'Task 1',
      taskDescription: 'Task 1 description',
      code: 'T1',
    }

    it('should create a new task, save it to the DB and return it', async () => {
      const response = await taskService.create(taskToCreate)

      expect(response).toHaveProperty('_id')
    })

    it('debe dar error cuando hay duplicidad de codigo', async () => {
      const response = await taskService.create(taskToCreate)
      expect(response).toEqual([
        'La tarea con el código T1 ya existe en la base de datos',
      ])
    })

    it('should return error if code is empty', async () => {
      const taskToCreateWithNoCode = {
        taskName: 'Task 1',
        taskDescription: 'Task 1 description',
        code: '',
      }
      const response = await taskService.create(taskToCreateWithNoCode)
      expect(response).toEqual(['El campo code es requerido'])
    })

    it('should return a list of errors if the taskName, taskDescription and code are empty', async () => {
      const taskToCreateWithNoCode = {
        taskName: '',
        taskDescription: '',
        code: '',
      }

      const response = await taskService.create(taskToCreateWithNoCode)

      expect(response).toEqual([
        'El campo taskName es requerido',
        'El campo taskDescription es requerido',
        'El campo code es requerido',
      ])
    })
  })
})
