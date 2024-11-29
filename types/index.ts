export type TokenRoles = { id: number; name: string }[];
export interface TokenPayload {
  id: number;
  roles: TokenRoles;
  iat: number;
  exp: number;
}
