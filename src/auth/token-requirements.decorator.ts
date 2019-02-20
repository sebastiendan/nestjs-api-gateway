import { ReflectMetadata } from '@nestjs/common';
import { TokenTypeEnum, UserRoleEnum } from './auth.interfaces';

export const TokenRequirements = (requiredTokenType: TokenTypeEnum, requiredUserRoles: UserRoleEnum[]) =>
  ReflectMetadata('tokenrequirements', new TokenRequirementsHelper(requiredTokenType, requiredUserRoles));

export class TokenRequirementsHelper {

  private requiredTokenType: TokenTypeEnum;
  private requiredUserRoles: UserRoleEnum[];

  constructor(requiredTokenType: TokenTypeEnum, requiredUserRoles: UserRoleEnum[]) {
    this.requiredTokenType = requiredTokenType;
    this.requiredUserRoles = requiredUserRoles;
  }

  public tokenIsOfType(tokenType: TokenTypeEnum): boolean {
    return tokenType === this.requiredTokenType;
  }

  public tokenHasAllUserRoles(userRoles: UserRoleEnum[]): boolean {
    return this.requiredUserRoles.every(requiredRole => userRoles.indexOf(requiredRole) > -1) || this.requiredUserRoles.length === 0;
  }
}