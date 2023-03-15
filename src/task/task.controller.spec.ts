import { MongooseModule } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, HttpStatus } from '@nestjs/common'
import * as request from 'supertest'
import { validate } from 'class-validator'
import { MongoHelper } from '../../test/mongo-helper'
import { Task, TaskSchema } from './entities/task.entity'
import { TaskController } from './task.controller'
import { TaskService } from './task.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { FilterDto } from './dto/filter-task.dto'

describe('TaskController', () => {
  let taskController: TaskController
  let app: INestApplication
  const mongoServer = MongoHelper.createServer()

  beforeAll(async () => {
    const path = `${__dirname}\\fixtures`
    const mongoUri = await MongoHelper.setup(path, await mongoServer)

    const module: TestingModule = await Test.createTestingModule({
      imports: [
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
    await MongoHelper.stop(await mongoServer)
    await app.close()
  })

  it('should be defined', () => {
    expect(taskController).toBeDefined()
  })

  describe('GET /task/status', () => {
    it('get the list of status', async () => {
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
      const response = await request(app.getHttpServer())
        .get('/task/status')
        .expect(HttpStatus.OK)

      expect(response.body).toEqual(taskStatus)
    })
  })

  describe('POST /task', () => {
    it('should return error if taskName is empty', async () => {
      const task = {
        taskDescription: 'Task 1 description',
        code: 'code-1',
      }

      const createTaskDto = new CreateTaskDto()
      Object.assign(createTaskDto, task)
      const errors = await validate(createTaskDto)

      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'El campo taskName es requerido',
        isString: 'El campo taskName debe ser una cadena de texto',
      })
    })

    it('should return a list of errors if the taskName, taskDescription and code are empty', async () => {
      const createTaskDto = new CreateTaskDto()

      const errors = await validate(createTaskDto)

      expect(errors[0].constraints).toEqual({
        isNotEmpty: 'El campo taskName es requerido',
        isString: 'El campo taskName debe ser una cadena de texto',
      })
      expect(errors[1].constraints).toEqual({
        isNotEmpty: 'El campo taskDescription es requerido',
        isString: 'El campo taskDescription debe ser una cadena de texto',
      })
      expect(errors[2].constraints).toEqual({
        isNotEmpty: 'El campo code es requerido',
        isString: 'El campo code debe ser una cadena de texto',
      })
    })

    it('get task created', async () => {
      const task = {
        taskName: 'Task 1',
        taskDescription: 'Task 1 description',
        code: 'T1',
      }
      const response = await request(app.getHttpServer())
        .post('/task')
        .send(task)
        .expect(HttpStatus.CREATED)

      expect(response.body).toEqual({
        ...task,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        _id: expect.any(String),
        statusId: 1,
        ['__v']: expect.any(Number),
      })
    })
  })

  describe('GET /task', () => {
    it('get list the amount and list of tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/task')
        .expect(HttpStatus.OK)

      expect(response.body).toMatchObject({
        count: expect.any(Number),
        task: expect.any(Array),
      })
    })

    it('Returns a list when performing a query', async () => {
      const response = await request(app.getHttpServer())
        .get('/task')
        .query({ search: 'nestjs' })
        .expect(HttpStatus.OK)

      expect(response.body).toMatchObject({
        count: expect.any(Number),
        task: expect.any(Array),
      })
    })

    it('Returns a error when statusId is not number', async () => {
      const queryDto = {
        statusId: false,
      }

      const filterDto = new FilterDto()
      Object.assign(filterDto, queryDto)
      const errors = await validate(filterDto)

      expect(errors[0].constraints).toEqual({
        isNumber: 'El campo statusId debe ser un número',
        isPositive: 'El campo statusId debe ser un número positivo',
      })
    })

    it('Returns a error when statusId is not number positive', async () => {
      const queryDto = {
        statusId: -1,
      }

      const filterDto = new FilterDto()
      Object.assign(filterDto, queryDto)
      const errors = await validate(filterDto)

      expect(errors[0].constraints).toEqual({
        isPositive: 'El campo statusId debe ser un número positivo',
      })
    })
  })
})
