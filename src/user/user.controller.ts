import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiUseTags } from '@nestjs/swagger'

import { IAccessToken, TokenTypeEnum } from '../auth/auth.interfaces'
import { TokenRequirements } from '../auth/token-requirements.decorator'
import { Token } from '../auth/token.decorator'
import { TokenGuard } from '../auth/token.guard'
import { UserService } from './user.service'

@Controller('user')
@ApiUseTags('user')
@UseGuards(TokenGuard)
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ title: 'Get user profile' })
  @ApiBearerAuth()
  @TokenRequirements(TokenTypeEnum.CLIENT, [])
  public async getUserProfile(@Token() token: IAccessToken) {
    return this.userService.getUserProfile(token.id)
  }

  @Get('profile/:userId')
  @ApiOperation({ title: 'Get user profile by user id' })
  @ApiBearerAuth()
  @TokenRequirements(TokenTypeEnum.CLIENT, [])
  public async getUserProfileByUserId(@Param('userId') userId: number) {
    return this.userService.getUserProfile(userId)
  }
}
