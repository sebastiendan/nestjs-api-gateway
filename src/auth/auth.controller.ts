import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiUseTags } from '@nestjs/swagger'

import { CreateAuthUserDto, VerifyAuthUserByEmailDto } from './auth.dto'
import { IAccessToken, IAuthUser, TokenTypeEnum } from './auth.interfaces'
import { AuthService } from './auth.service'
import { TokenRequirements } from './token-requirements.decorator'
import { Token } from './token.decorator'
import { TokenGuard } from './token.guard'

@Controller('auth')
@ApiUseTags('authentication')
@UseGuards(TokenGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('getAuthUserByToken')
  @ApiOperation({ title: 'Verify token authenticity, sign in user if valid' })
  @ApiBearerAuth()
  @TokenRequirements(TokenTypeEnum.CLIENT, [])
  public async getAuthUserByToken(
    @Token() token: IAccessToken
  ): Promise<IAuthUser> {
    const { exp, iat, iss, ...user } = token
    return this.authService.getAuthUser(user.id)
  }

  @Post('createAuthUser')
  @ApiOperation({ title: 'Sign up a new user' })
  public async createAuthUser(
    @Body() createAuthUserDto: CreateAuthUserDto
  ): Promise<{ user: IAuthUser; token: string }> {
    const authUser = await this.authService.createAuthUser(createAuthUserDto)
    return {
      token: this.authService.createAccessTokenFromAuthUser(authUser),
      user: authUser,
    }
  }

  @Post('verifyAuthUserByEmail')
  @ApiOperation({ title: 'Sign in user via email and password' })
  public async verifyAuthUserByEmail(
    @Body() verifyAuthUserByEmailDto: VerifyAuthUserByEmailDto
  ): Promise<any> {
    const user = await this.authService.verifyAuthUserByEmail(
      verifyAuthUserByEmailDto
    )
    return { user, token: this.authService.createAccessTokenFromAuthUser(user) }
  }
}
