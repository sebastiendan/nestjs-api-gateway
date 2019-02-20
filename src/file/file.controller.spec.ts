import { Test, TestingModule } from '@nestjs/testing'
import { FileController } from './file.controller'

describe('File Controller', () => {
  let module: TestingModule
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [FileController],
    }).compile()
  })
  it('should be defined', () => {
    const controller: FileController = module.get<FileController>(
      FileController
    )
    expect(controller).toBeDefined()
  })
})
