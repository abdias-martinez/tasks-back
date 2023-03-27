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
import { TypeStatusEnum } from './interfaces/task-status'
import { UpdateTaskDTO } from './dto/update-task.dto'

describe('TaskController', () => {
  let taskController: TaskController
  let app: INestApplication
  const mongoServer = MongoHelper.createServer()

  beforeAll(async () => {
    const path = 'src/task/fixtures'
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
          id: TypeStatusEnum.CREATE,
          name: 'Creada',
        },
        {
          id: TypeStatusEnum.IN_PROCESS,
          name: 'En proceso',
        },
        {
          id: TypeStatusEnum.FINISHED,
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
        statusId: TypeStatusEnum.CREATE,
        ['__v']: expect.any(Number),
      })
    })
  })

  describe('GET /task', () => {
    const EXPECTED_TASKS = [
      {
        id: expect.any(String),
        taskName: 'Task 2',
        taskDescription: 'Task 2 description nestjs',
        code: 'task-2',
        status: {
          id: TypeStatusEnum.IN_PROCESS,
          name: 'En proceso',
        },
        updatedAt: '10/03/2023 20:46',
      },
      {
        id: expect.any(String),
        taskName: 'Task 5',
        taskDescription: 'Task 5 description nestjs',
        code: 'task-5',
        status: {
          id: TypeStatusEnum.CREATE,
          name: 'Creada',
        },
        updatedAt: '10/03/2023 21:46',
      },
    ]

    it('get list the amount and list of tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/task')
        .expect(HttpStatus.OK)

      expect(response.body).toMatchObject({
        count: 8,
        task: expect.any(Array),
      })
    })

    it('Returns a list when performing a query', async () => {
      const response = await request(app.getHttpServer())
        .get('/task')
        .query({ search: 'nestjs' })
        .expect(HttpStatus.OK)

      expect(response.body).toMatchObject({
        count: 2,
        task: EXPECTED_TASKS,
      })
    })

    it('Returns a error when statusId is not number string', async () => {
      const queryDto = {
        statusId: 'CREATESs',
      }

      const filterDto = new FilterDto()
      Object.assign(filterDto, queryDto)
      const errors = await validate(filterDto)

      expect(errors[0].constraints).toEqual({
        isEnum: 'El valor: CREATESs no es correcto de la propiedad statusId',
      })
    })
  })

  describe('GET /task/:id', () => {
    it('should return an error if it is not a valid id', async () => {
      const taskId = '6407dcfc92c931a743a169qwe'
      const response = await request(app.getHttpServer())
        .get(`/task/${taskId}`)
        .expect(HttpStatus.BAD_REQUEST)

      expect(response.body).toMatchObject({
        error: 'Bad Request',
        message: [`El id ${taskId} no se encuentra en la base de datos`],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    })

    it('should return a task by ID', async () => {
      const taskId = '6407dcfc92c931a743a169d7'
      const response = await request(app.getHttpServer())
        .get(`/task/${taskId}`)
        .expect(HttpStatus.OK)

      expect(response.body).toMatchObject({
        id: expect.any(String),
        taskName: 'Task 7',
        taskDescription: 'Task 7 description',
        code: 'task-7',
        status: {
          id: 'CREATE',
          name: 'Creada',
        },
        createdAt: '10/03/2023 21:46',
        updatedAt: '10/03/2023 21:46',
      })
    })
  })

  describe('PUT /task/:id with body task', () => {
    it('should return an error if it is not a valid id', async () => {
      const taskId = '6407dcfc92c931a743a169qwe'
      const response = await request(app.getHttpServer())
        .get(`/task/${taskId}`)
        .send({ statusID: TypeStatusEnum.CREATE })
        .expect(HttpStatus.BAD_REQUEST)

      expect(response.body).toMatchObject({
        error: 'Bad Request',
        message: [`El id ${taskId} no se encuentra en la base de datos`],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    })

    it('should give an error when the status is not correct', async () => {
      const statusIdDto = {
        statusId: 'TERMINADAs',
      }

      const updateTaskDTO = new UpdateTaskDTO()
      Object.assign(updateTaskDTO, statusIdDto)
      const errors = await validate(updateTaskDTO)

      expect(errors[0].constraints).toEqual({
        isEnum: 'El valor: TERMINADAs no es correcto de la propiedad statusId',
      })
    })

    it('should give an error when taskName and taskDescription are not string', async () => {
      const taskDto = {
        taskName: {},
        taskDescription: 0,
      }

      const updateTaskDTO = new UpdateTaskDTO()
      Object.assign(updateTaskDTO, taskDto)
      const errors = await validate(updateTaskDTO)

      expect(errors[0].constraints).toEqual({
        isString: 'El campo taskName debe ser una cadena de texto',
      })
      expect(errors[1].constraints).toEqual({
        isString: 'El campo taskDescription debe ser una cadena de texto',
      })
    })

    it('should return a new updated task with status by ID', async () => {
      const taskId = '6407dcfc92c931a743a169d3'
      const response = await request(app.getHttpServer())
        .patch(`/task/${taskId}`)
        .send({ statusId: TypeStatusEnum.FINISHED })
        .expect(HttpStatus.OK)

      expect(response.body).toMatchObject({
        id: expect.any(String),
        taskName: 'Task 3',
        taskDescription: 'Task 3 description next',
        code: 'task-3',
        status: {
          id: 'FINISHED',
          name: 'Terminada',
        },
        createdAt: '10/03/2023 21:46',
        updatedAt: expect.any(String),
      })
    })

    it('should return a new updated task', async () => {
      const taskId = '6407dcfc92c931a743a169d7'
      const response = await request(app.getHttpServer())
        .patch(`/task/${taskId}`)
        .send({
          taskName: 'Updated task',
          taskDescription: 'Updated task description',
        })
        .expect(HttpStatus.OK)

      expect(response.body).toMatchObject({
        id: expect.any(String),
        taskName: 'Updated task',
        taskDescription: 'Updated task description',
        code: 'task-7',
        status: {
          id: 'CREATE',
          name: 'Creada',
        },
        createdAt: '10/03/2023 21:46',
        updatedAt: expect.any(String),
      })
    })
  })
})
