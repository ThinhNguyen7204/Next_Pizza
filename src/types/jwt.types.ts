import { Role } from '@/constants/type'

export interface TokenPayload {
  userId: string
  role: typeof Role[keyof typeof Role]
  exp: number
  iat: number
  tokenType: string
}

export type RoleType = typeof Role[keyof typeof Role]
