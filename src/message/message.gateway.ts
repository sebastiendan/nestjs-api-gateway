import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { Socket } from 'socket.io'

import { IMessage, IParticipant, IThread } from './message.interface'
import { MessageService } from './message.service'

@WebSocketGateway()
export class MessageGateway {
  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('SEND_MESSAGE_SUCCESS')
  public async sendMessage(io: Socket, data: IMessage): Promise<IMessage> {
    const participants: IParticipant[] = await this.messageService.findOtherParticipantsInThread(
      { threadId: data.thread.id, userId: (io as any).token.id }
    )
    await this.dispatchMessage('SEND_MESSAGE_SUCCESS', io, participants, data)
    return data
  }

  @SubscribeMessage('CREATE_THREAD_SUCCESS')
  public async createThread(io: Socket, data: IThread): Promise<IThread> {
    const participants: IParticipant[] = await this.messageService.findOtherParticipantsInThread(
      { threadId: data.id, userId: (io as any).token.id }
    )
    await this.dispatchMessage('GET_THREAD_SUCCESS', io, participants, data)
    return data
  }

  // Using redis-io adapter custom hook/request to reach connected sockets on all nodes
  private async dispatchMessage(
    id: string,
    io: Socket,
    participants: IParticipant[],
    data: IMessage | IThread
  ) {
    for (const participant of participants) {
      ;(io.server.of('/').adapter as any).customRequest(
        participant.userId,
        (error: any, socketIds: any[]) => {
          if (error) {
            // tslint:disable-next-line:no-console
            console.log(error)
          }
          ;[].concat.apply([], socketIds).forEach(x => {
            io.to(x).emit(id, data)
          })
        }
      )
    }
  }
}
