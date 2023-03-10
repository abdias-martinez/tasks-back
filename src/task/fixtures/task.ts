// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ObjectId } = require('mongodb')

import { TypeStatusEnum } from '../interfaces/task-status'

module.exports = [
  {
    _id: ObjectId(),
    taskName: 'Task 1',
    taskDescription: 'Task 1 description',
    code: 'task-1',
    statusId: TypeStatusEnum.CREATE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
