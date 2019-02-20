import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/auth.service'
import { UserService } from '../user/user.service'
import { MessageController } from './message.controller'
import { MessageGateway } from './message.gateway'
import { MessageService } from './message.service'

@Module({
  controllers: [MessageController],
  imports: [AuthModule],
  providers: [AuthService, UserService, MessageGateway, MessageService],
})
export class MessageModule {}
