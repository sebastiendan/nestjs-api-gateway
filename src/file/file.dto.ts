import { ApiModelProperty } from '@nestjs/swagger'

export class FileMetadataDto {
  @ApiModelProperty({
    description: 'Container name',
    example: 'avatar',
    required: true,
    type: 'string',
  })
  public readonly container: string

  @ApiModelProperty({
    description: 'File name',
    example: 'user-3',
    required: true,
    type: 'string',
  })
  public readonly name: string
}
