import { createParamDecorator } from '@nestjs/common'

export const Token = createParamDecorator((_, req) => req.token)
