import { HttpException, Injectable } from '@nestjs/common'
import { Client, ClientProxy, Transport } from '@nestjs/microservices'

import { IPagination } from '../common/entities/pagination.entity'
import {
  CreateMessageDto,
  CreateThreadDto,
  FindOtherParticipantsInThreadDto,
  FindParticipantInThreadDto,
} from './message.dto'
import { IMessage, IParticipant, IThread } from './message.interface'

@Injectable()
export class MessageService {
  @Client({
    options: { host: 'message', port: 3000 },
    transport: Transport.TCP,
  })
  private client: ClientProxy

  public async findAllThreads(userId: number): Promise<IThread[]> {
    return this.client
      .send<IThread[]>({ cmd: 'getAllThreads' }, userId)
      .toPromise()
      .catch(error => {
        throw new HttpException(error, error.status)
      })
  }

  public async findThreadFromParticipantsIds(ids: number[]): Promise<IThread> {
    return this.client
      .send<IThread>({ cmd: 'getThreadFromParticipantsIds' }, ids)
      .toPromise()
      .catch(error => {
        throw new HttpException(error, error.status)
      })
  }

  public async createThread(
    createThreadDto: CreateThreadDto
  ): Promise<IThread> {
    return this.client
      .send<IThread>({ cmd: 'createThread' }, createThreadDto)
      .toPromise()
      .catch(error => {
        throw new HttpException(error, error.status)
      })
  }

  public async findAllThreadMessages(
    threadId: number,
    pagination: IPagination
  ): Promise<IMessage[]> {
    return this.client
      .send<IMessage[]>(
        { cmd: 'getAllThreadMessages' },
        { threadId, pagination }
      )
      .toPromise()
      .catch(error => {
        throw new HttpException(error, error.status)
      })
  }

  public async findLatestThreadMessage(threadId: number): Promise<IMessage[]> {
    return this.client
      .send<IMessage[]>({ cmd: 'getLatestThreadMessage' }, threadId)
      .toPromise()
      .catch(error => {
        throw new HttpException(error, error.status)
      })
  }

  public async checkIfThreadHasNewMessage(
    threadId: number,
    userId: number
  ): Promise<boolean> {
    return this.client
      .send<boolean>(
        { cmd: 'checkIfThreadHasNewMessage' },
        { threadId, userId }
      )
      .toPromise()
      .catch(error => {
        throw new HttpException(error, error.status)
      })
  }

  public async findParticipantInThread(
    findParticipantInThreadDto: FindParticipantInThreadDto
  ): Promise<IParticipant> {
    return this.client
      .send<IParticipant>(
        { cmd: 'findParticipantInThread' },
        findParticipantInThreadDto
      )
      .toPromise()
      .catch(error => {
        throw new HttpException(error, error.status)
      })
  }

  public async findOtherParticipantsInThread(
    findOtherParticipantsInThreadDto: FindOtherParticipantsInThreadDto
  ): Promise<IParticipant[]> {
    return this.client
      .send<IParticipant[]>(
        { cmd: 'findOtherParticipantsInThread' },
        findOtherParticipantsInThreadDto
      )
      .toPromise()
      .catch(error => {
        throw new HttpException(error, error.status)
      })
  }

  public async createMessage(
    createMessageDto: CreateMessageDto
  ): Promise<IMessage> {
    return this.client
      .send<IMessage>({ cmd: 'createMessage' }, createMessageDto)
      .toPromise()
      .catch(error => {
        throw new HttpException(error, error.status)
      })
  }

  public async unNewThreadMessages(threadId: number): Promise<any> {
    return this.client
      .send<any>({ cmd: 'unNewThreadMessages' }, threadId)
      .toPromise()
      .catch(error => {
        throw new HttpException(error, error.status)
      })
  }
}
