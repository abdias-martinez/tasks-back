import { Test, TestingModule } from '@nestjs/testing'
import { StatusController } from './status.controller'
import { StatusService } from './status.service'

describe('StatusController', () => {
  let controller: StatusController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [StatusService],
    }).compile()

    controller = module.get<StatusController>(StatusController)
  })

  it('Debe ser definido', () => {
    expect(controller).toBeDefined()
  })

  it('Debe de devolver una matriz de estados', () => {
    const result = controller.executeStatus()

    // eslint-disable-next-line no-magic-numbers
    expect(result).toHaveLength(3)
  })
})
