import { HttpException, Injectable } from '@nestjs/common'
import { Client, ClientProxy, Transport } from '@nestjs/microservices'
import * as jwt from 'jsonwebtoken'

import { AuthConstants } from './auth.constants'
import { CreateAuthUserDto, VerifyAuthUserByEmailDto } from './auth.dto'
import { IAccessToken, IAuthUser, TokenTypeEnum } from './auth.interfaces'

@Injectable()
export class AuthService {
  @Client({
    options: { host: 'auth', port: 3000 },
    transport: Transport.TCP,
  })
  private client: ClientProxy

  public async getAuthUser(id: number): Promise<IAuthUser> {
    return this.client
      .send<IAuthUser>({ cmd: 'getAuthUser' }, id)
      .toPromise()
      .catch(error => {
        throw new HttpException(error, error.status)
      })
  }

  public async createAuthUser(
    createAuthUserDto: CreateAuthUserDto
  ): Promise<IAuthUser> {
    return this.client
      .send<IAuthUser>({ cmd: 'createAuthUser' }, createAuthUserDto)
      .toPromise()
      .catch(error => {
        throw new HttpException(error, error.status)
      })
  }

  public async verifyAuthUserByEmail(
    user: VerifyAuthUserByEmailDto
  ): Promise<IAuthUser> {
    return this.client
      .send<IAuthUser>({ cmd: 'verifyAuthUserByEmail' }, user)
      .toPromise()
      .catch(error => {
        throw new HttpException(error, error.status)
      })
  }

  public validateAccessToken(token: string): IAccessToken {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: AuthConstants.access_token.options.issuer,
    }) as IAccessToken
  }

  public createAccessTokenFromAuthUser(user: IAuthUser): string {
    const payload = {
      email: user.email,
      id: user.id,
      roles: [user.role],
      type: TokenTypeEnum.CLIENT,
    }
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      AuthConstants.access_token.options
    )
  }
}
