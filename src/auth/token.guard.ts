import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { AuthService } from './auth.service'
import { TokenRequirementsHelper } from './token-requirements.decorator'

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService
  ) {}

  public async canActivate(context: ExecutionContext) {
    // check if the decorator is present
    const tokenRequirements = this.reflector.get<TokenRequirementsHelper>(
      'tokenrequirements',
      context.getHandler()
    )
    if (!tokenRequirements) {
      return true
    } else {
      const req = context.switchToHttp().getRequest()
      if (
        req.headers.authorization &&
        (req.headers.authorization as string).split(' ')[0] === 'Bearer'
      ) {
        try {
          // validate token
          const token = (req.headers.authorization as string).split(' ')[1]
          const decodedToken = await this.authService.validateAccessToken(token)

          // check if token is of the right type
          if (!tokenRequirements.tokenIsOfType(decodedToken.type)) return false

          // save token in request object
          req.token = decodedToken

          return true
        } catch (err) {
          return false
        }
      } else {
        return false
      }
    }
  }
}
