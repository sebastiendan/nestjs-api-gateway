import { ApiModelProperty } from '@nestjs/swagger'

export class CreateAuthUserDto {
  @ApiModelProperty({
    description: 'User email',
    example: 'test@test.com',
    required: true,
    type: 'string',
  })
  public readonly email: string

  @ApiModelProperty({
    description: 'User password',
    example: 'password',
    required: true,
    type: 'string',
  })
  public readonly password: string
}

export class VerifyAuthUserByEmailDto {
  @ApiModelProperty({
    description: 'User email',
    example: 'test@test.com',
    required: true,
    type: 'string',
  })
  public readonly email: string

  @ApiModelProperty({
    description: 'User password',
    example: 'password',
    required: true,
    type: 'string',
  })
  public readonly password: string
}
