import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/auth.service'
import { FileController } from './file.controller'
import { FileService } from './file.service'

@Module({
  controllers: [FileController],
  imports: [AuthModule],
  providers: [AuthService, FileService],
})
export class FileModule {}
