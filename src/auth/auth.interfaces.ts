export interface IAuthUser {
  createdAt: Date
  email: string
  id: number
  role: UserRoleEnum
  updatedAt: Date
}

export interface IAccessToken {
  readonly email: string
  readonly exp: number
  readonly iat: number
  readonly id: number
  readonly iss: number
  readonly type: TokenTypeEnum
}

export enum TokenTypeEnum {
  CLIENT,
  SYSTEM,
}

export enum UserRoleEnum {
  REGULAR,
}

export const UserRoleEnumAsArray = Object.keys(UserRoleEnum)
