export interface TokenPayload {
  id: number;
  roles: { id: number; name: string }[];
  iat: number;
  exp: number;
}
