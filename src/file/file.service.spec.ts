import { Test, TestingModule } from '@nestjs/testing'
import { FileService } from './file.service'

describe('FileService', () => {
  let service: FileService
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile()
    service = module.get<FileService>(FileService)
  })
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
