import { IoAdapter } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import * as redisIoAdapter from 'socket.io-redis'
import * as socketioJwt from 'socketio-jwt'

import { IAccessToken } from './auth/auth.interfaces'

const redisAdapter = redisIoAdapter({ host: 'redis', port: 80 })

export class RedisIoAdapter extends IoAdapter {
  public createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options)
    server.adapter(redisAdapter)
    server.use(
      socketioJwt.authorize({
        decodedPropertyName: 'token',
        handshake: true,
        secret: process.env.JWT_SECRET,
      })
    )

    server.of('/').adapter.customHook = (
      userId: string,
      callback: (socketIds?: string[]) => void
    ) => {
      callback(
        Object.keys(server.sockets.connected)
          .map(key => server.sockets.connected[key])
          .filter(x => x.token.id === userId)
          .map(x => x.id)
      )
    }
    return server
  }
}
