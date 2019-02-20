import { ApiModelProperty } from '@nestjs/swagger'

export class Participant {
  @ApiModelProperty({
    description: 'User id',
    example: 1,
    required: true,
    type: 'number',
  })
  public readonly userId: number
}

export class CreateThreadDto {
  @ApiModelProperty({
    description: 'First message content',
    example: 'This is a message',
    required: true,
    type: 'string',
  })
  public readonly firstMessageContent: string

  @ApiModelProperty({
    description: 'Participants',
    isArray: true,
    maxLength: 2,
    minLength: 2,
    required: true,
    type: Participant,
  })
  public readonly participants: Participant[]
}

export class CreateMessageDto {
  @ApiModelProperty({
    description: 'Message content',
    example: 'This is a message',
    required: true,
    type: 'string',
  })
  public readonly content: string

  public participantId: number

  @ApiModelProperty({
    description: 'Thread id',
    example: 1,
    required: true,
    type: 'number',
  })
  public readonly threadId: number
}

export class FindParticipantInThreadDto {
  @ApiModelProperty({
    description: 'Thread id',
    example: 1,
    required: true,
    type: 'number',
  })
  public readonly threadId: number

  @ApiModelProperty({
    description: 'User id',
    example: 1,
    required: true,
    type: 'number',
  })
  public readonly userId: number
}

export class FindOtherParticipantsInThreadDto {
  @ApiModelProperty({
    description: 'Thread id',
    example: 1,
    required: true,
    type: 'number',
  })
  public readonly threadId: number

  @ApiModelProperty({
    description:
      'Id of the user that should be excluded from the searched users',
    example: 1,
    required: true,
    type: 'number',
  })
  public readonly userId: number
}
