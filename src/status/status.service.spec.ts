import { Test, TestingModule } from '@nestjs/testing'
import { StatusService } from './status.service'

describe('StatusService', () => {
  let service: StatusService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusService],
    }).compile()

    service = module.get<StatusService>(StatusService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('Debe ejecutar una matriz de estados y ser llamado una vez', () => {
    jest
      .spyOn(service, 'getAll')
      .mockImplementation(() => [{ statusId: 1, statusName: 'Creada' }])
    const result = service.getAll()

    expect(result).toHaveLength(1)
    expect(service.getAll).toHaveBeenCalledTimes(1)
  })
})
