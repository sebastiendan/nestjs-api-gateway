import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { MessageModule } from './message/message.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [AuthModule, MessageModule, UserModule],
})
export class AppModule {}
