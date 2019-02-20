import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';

describe('Message Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [MessageController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: MessageController = module.get<MessageController>(MessageController);
    expect(controller).toBeDefined();
  });
});
