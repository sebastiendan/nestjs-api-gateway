import { HttpException, Injectable } from '@nestjs/common'
import { Transport } from '@nestjs/common/enums/transport.enum'
import { Client, ClientProxy } from '@nestjs/microservices'
import { IUser } from './user.interface'

@Injectable()
export class UserService {
  @Client({
    options: { host: 'user', port: 3000 },
    transport: Transport.TCP,
  })
  public client: ClientProxy

  public async getUserProfile(userId: number): Promise<IUser> {
    return this.client
      .send<IUser>({ cmd: 'getProfile' }, userId)
      .toPromise()
      .catch(error => {
        throw new HttpException(error, error.status)
      })
  }
}
