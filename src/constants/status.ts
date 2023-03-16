import { TypeStatusEnum } from '../task/interfaces/task-status'

export const TASK_STATUS = [
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
