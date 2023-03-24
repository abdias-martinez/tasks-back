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
    const path = 'src/task/fixtures'
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
    it('Returns the list of tasks with the values', async () => {
      const response = await taskService.getAll({})

      expect(response.task[0]).toMatchObject({
        id: expect.any(String),
        code: 'task-1',
        status: {
          id: TypeStatusEnum.CREATE,
          name: 'Creada',
        },
        taskName: 'Task 1',
        taskDescription: 'Task 1 description',
        updatedAt: '10/03/2023 19:46',
      })
    })

    it('Returns the list of tasks filtered by the statusId', async () => {
      const EXPECTED_TASKS = 2
      const filter = { statusId: TypeStatusEnum.IN_PROCESS }
      const response = await taskService.getAll(filter)

      expect(response.task).toHaveLength(EXPECTED_TASKS)
    })

    it('Returns the list of tasks filtered by the search (taskName, taskDescription)', async () => {
      const filter = { search: 'task 2' }
      const response = await taskService.getAll(filter)

      expect(response).toMatchObject({
        count: 1,
        task: [
          {
            id: expect.any(String),
            code: 'task-2',
            status: {
              id: TypeStatusEnum.IN_PROCESS,
              name: 'En proceso',
            },
            taskName: 'Task 2',
            taskDescription: 'Task 2 description nestjs',
            updatedAt: '10/03/2023 20:46',
          },
        ],
      })
    })

    it('Returns the lis/t of tasks filtered by the search and statusId', async () => {
      const filter = { search: 'next', statusId: TypeStatusEnum.IN_PROCESS }
      const response = await taskService.getAll(filter)

      expect(response).toMatchObject({
        count: 1,
        task: [
          {
            id: expect.any(String),
            code: 'task-3',
            status: {
              id: TypeStatusEnum.IN_PROCESS,
              name: 'En proceso',
            },
            taskName: 'Task 3',
            taskDescription: 'Task 3 description next',
            updatedAt: '10/03/2023 21:46',
          },
        ],
      })
    })
  })

  describe('When the get method is called by ID', () => {
    it('should give an error when the id does not exist', async () => {
      await expect(
        taskService.getTaskById('6407dcfc92c931a743a169d8'),
      ).rejects.toThrow(
        new BadRequestException([
          'No se encontró datos con el id 6407dcfc92c931a743a169d8',
        ]),
      )
    })

    it('should query a task and return it', async () => {
      const response = await taskService.getTaskById('6407dcfc92c931a743a169d7')

      expect(response).toMatchObject({
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

  describe('When the put method is called by ID and state ID', () => {
    it('should give an error when the id does not exist', async () => {
      await expect(
        taskService.updateTaskStatusById('6407dcfc92c931a743a169d6', {
          statusId: TypeStatusEnum.CREATE,
        }),
      ).rejects.toThrow(
        new BadRequestException([
          'No se encontró datos con el id 6407dcfc92c931a743a169d8',
        ]),
      )
    })

    it('should give an error when the task status has finished', async () => {
      await expect(
        taskService.updateTaskStatusById('6407dcfc92c931a743a169d6', {
          statusId: TypeStatusEnum.FINISHED,
        }),
      ).rejects.toThrow(
        new BadRequestException(['La tarea ya está en estado Terminada']),
      )
    })

    it('should update task status', async () => {
      const statusId = '6407dcfc92c931a743a169d3'

      const task = await taskService.getTaskById(statusId)

      expect(task).toMatchObject({
        id: expect.any(String),
        taskName: 'Task 3',
        taskDescription: 'Task 3 description next',
        code: 'task-3',
        status: {
          id: 'IN_PROCESS',
          name: 'En proceso',
        },
        createdAt: '10/03/2023 21:46',
        updatedAt: '10/03/2023 21:46',
      })

      const response = await taskService.updateTaskStatusById(statusId, {
        statusId: TypeStatusEnum.FINISHED,
      })

      expect(response).toMatchObject({
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
  })
})
