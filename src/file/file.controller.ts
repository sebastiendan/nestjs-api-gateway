import {
  Body,
  Controller,
  FileInterceptor,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiImplicitFile,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger'

import { IAccessToken, TokenTypeEnum } from '../auth/auth.interfaces'
import { TokenRequirements } from '../auth/token-requirements.decorator'
import { Token } from '../auth/token.decorator'
import { TokenGuard } from '../auth/token.guard'
import { FileMetadataDto } from './file.dto'
import { FileService } from './file.service'

@Controller('file')
@ApiUseTags('file')
@UseGuards(TokenGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiOperation({ title: 'Upload a file' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file', required: true, description: 'File' })
  @ApiBearerAuth()
  @TokenRequirements(TokenTypeEnum.CLIENT, [])
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() meta: FileMetadataDto
  ) {
    return this.fileService.upload(file, meta)
  }

  @Post('download')
  @ApiOperation({ title: 'Download a file' })
  @ApiBearerAuth()
  @TokenRequirements(TokenTypeEnum.CLIENT, [])
  public async downloadFile(@Body() meta: FileMetadataDto) {
    return this.fileService.download(meta)
  }

  @Get('avatar')
  @ApiOperation({ title: 'Download user avatar' })
  @ApiBearerAuth()
  @TokenRequirements(TokenTypeEnum.CLIENT, [])
  public async downloadAvatar(@Token() token: IAccessToken) {
    const meta: FileMetadataDto = {
      container: 'avatar',
      name: `user-${token.id}`,
    }
    return this.fileService.download(meta)
  }
}
