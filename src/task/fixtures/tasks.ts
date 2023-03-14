import { TypeStatusEnum } from '../interfaces/task-status'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ObjectId: ObjectId } = require('mongodb')

module.exports = [
  {
    _id: ObjectId('6407dcfc92c931a743a169d1'),
    taskName: 'Task 1',
    taskDescription: 'Task 1 description',
    code: 'task-1',
    statusId: TypeStatusEnum.CREATE,
    createdAt: new Date('2023-03-10T19:46:25.857Z'),
    updatedAt: new Date('2023-03-10T19:46:25.857Z'),
  },
  {
    _id: ObjectId('6407dcfc92c931a743a169d2'),
    taskName: 'Task 2',
    taskDescription: 'Task 2 description',
    code: 'task-2',
    statusId: TypeStatusEnum.CREATE,
    createdAt: new Date('2023-03-10T20:46:25.857Z'),
    updatedAt: new Date('2023-03-10T20:46:25.857Z'),
  },
  {
    _id: ObjectId('6407dcfc92c931a743a169d3'),
    taskName: 'Task 3',
    taskDescription: 'Task 3 description',
    code: 'task-3',
    statusId: TypeStatusEnum.CREATE,
    createdAt: new Date('2023-03-10T21:46:25.857Z'),
    updatedAt: new Date('2023-03-10T21:46:25.857Z'),
  },
  {
    _id: ObjectId('6407dcfc92c931a743a169d4'),
    taskName: 'Task 4',
    taskDescription: 'Task 4 description',
    code: 'task-4',
    statusId: TypeStatusEnum.CREATE,
    createdAt: new Date('2023-03-10T21:46:25.857Z'),
    updatedAt: new Date('2023-03-10T21:46:25.857Z'),
  },
  {
    _id: ObjectId('6407dcfc92c931a743a169d5'),
    taskName: 'Task 5',
    taskDescription: 'Task 5 description',
    code: 'task-5',
    statusId: TypeStatusEnum.CREATE,
    createdAt: new Date('2023-03-10T21:46:25.857Z'),
    updatedAt: new Date('2023-03-10T21:46:25.857Z'),
  },
  {
    _id: ObjectId('6407dcfc92c931a743a169d6'),
    taskName: 'Task 6',
    taskDescription: 'Task 6 description',
    code: 'task-6',
    statusId: TypeStatusEnum.CREATE,
    createdAt: new Date('2023-03-10T21:46:25.857Z'),
    updatedAt: new Date('2023-03-10T21:46:25.857Z'),
  },
  {
    _id: ObjectId('6407dcfc92c931a743a169d7'),
    taskName: 'Task 7',
    taskDescription: 'Task 7 description',
    code: 'task-7',
    statusId: TypeStatusEnum.CREATE,
    createdAt: new Date('2023-03-10T21:46:25.857Z'),
    updatedAt: new Date('2023-03-10T21:46:25.857Z'),
  },
]
