import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger'

import {
  IAccessToken,
  TokenTypeEnum,
  UserRoleEnum,
} from '../auth/auth.interfaces'
import { AuthService } from '../auth/auth.service'
import { TokenRequirements } from '../auth/token-requirements.decorator'
import { Token } from '../auth/token.decorator'
import { TokenGuard } from '../auth/token.guard'
import { IPagination } from '../common/entities/pagination.entity'
import { IUser } from '../user/user.interface'
import { UserService } from '../user/user.service'
import {
  CreateMessageDto,
  CreateThreadDto,
  FindParticipantInThreadDto,
} from './message.dto'
import { IParticipant, IThread } from './message.interface'
import { MessageService } from './message.service'

@Controller('message')
@ApiUseTags('message')
@UseGuards(TokenGuard)
export class MessageController {
  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly userService: UserService
  ) {}

  @Get('threads')
  @ApiBearerAuth()
  @TokenRequirements(TokenTypeEnum.CLIENT, [])
  public async findAllThreads(@Token() token: IAccessToken) {
    return this.messageService
      .findAllThreads(token.id)
      .then(async threads =>
        Promise.all(threads.map(async x => this.getThreadMetaData(x, token.id)))
      )
  }

  @Get('thread/:recipientUserId')
  @ApiBearerAuth()
  @TokenRequirements(TokenTypeEnum.CLIENT, [])
  public async findThreadFromParticipantsIds(
    @Token() token: IAccessToken,
    @Param('recipientUserId') recipientUserId: string
  ) {
    return this.messageService
      .findThreadFromParticipantsIds([token.id, +recipientUserId])
      .then(async threadResult => {
        if (threadResult) {
          return this.getThreadMetaData(threadResult, token.id)
        } else {
          const newThread = {
            participants: [
              { userId: token.id } as IParticipant,
              { userId: +recipientUserId } as IParticipant,
            ],
          }
          return this.getThreadMetaData(newThread as any, null, {
            teaser: true,
          })
        }
      })
  }

  @Post('thread')
  @ApiBearerAuth()
  @TokenRequirements(TokenTypeEnum.CLIENT, [])
  public async createThread(
    @Token() token: IAccessToken,
    @Body() createThreadDto: CreateThreadDto
  ) {
    const thread = await this.messageService.createThread(createThreadDto)

    const createMessageDto = {
      content: createThreadDto.firstMessageContent,
      threadId: thread.id,
    } as CreateMessageDto
    const findParticipantInThreadDto: FindParticipantInThreadDto = {
      threadId: thread.id,
      userId: token.id,
    }
    const participant = await this.messageService.findParticipantInThread(
      findParticipantInThreadDto
    )
    createMessageDto.participantId = participant.id
    await this.messageService.createMessage(createMessageDto)

    return this.getThreadMetaData(thread, token.id)
  }

  @Get('messages/:threadId')
  @ApiBearerAuth()
  @TokenRequirements(TokenTypeEnum.CLIENT, [])
  public async findAllThreadMessages(
    @Param('threadId') threadId: string,
    @Query() query
  ) {
    const pagination: IPagination = {
      skip: query.skip || 0,
      take: query.take || 10,
    }
    return this.messageService.findAllThreadMessages(+threadId, pagination)
  }

  @Post('send')
  @ApiBearerAuth()
  @TokenRequirements(TokenTypeEnum.CLIENT, [])
  public async sendMessage(
    @Token() token: IAccessToken,
    @Body() createMessageDto: CreateMessageDto
  ) {
    const findParticipantInThreadDto: FindParticipantInThreadDto = {
      threadId: createMessageDto.threadId,
      userId: token.id,
    }
    const participant = await this.messageService.findParticipantInThread(
      findParticipantInThreadDto
    )
    createMessageDto.participantId = participant.id

    const message = await this.messageService.createMessage(createMessageDto)

    return message
  }

  @Patch('unnew')
  @ApiBearerAuth()
  @TokenRequirements(TokenTypeEnum.CLIENT, [])
  public async unNewThreadMessages(@Body() data: { threadId: number }) {
    return this.messageService.unNewThreadMessages(data.threadId)
  }

  private async getThreadMetaData(
    thread: IThread,
    userId: number,
    options?: { teaser: boolean }
  ) {
    return {
      ...thread,
      latestMessage: thread.id
        ? await this.messageService.findLatestThreadMessage(thread.id)
        : '',
      newMessage: thread.id
        ? await this.messageService.checkIfThreadHasNewMessage(
            thread.id,
            userId
          )
        : false,
      participants: await Promise.all(
        thread.participants.map(async y => {
          let user: IUser
          const authUser = await this.authService.getAuthUser(y.userId)

          switch (authUser.role) {
            case UserRoleEnum.REGULAR:
              user = await this.userService.getUserProfile(y.userId)
              break
          }

          user.id = y.id
          return user
        })
      ),
    }
  }
}
