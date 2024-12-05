export interface TokenPayload {
  id: number;
  roles: string[];
  iat: number;
  exp: number;
}

export interface Cache {
  set: (key: any, value: any, options: any, cb?: any) => Promise<any>;
  get: (key: any, options: any, cb?: any) => Promise<any>;
  del: (...args: any[]) => Promise<any>;
  mset: (...args: any[]) => Promise<any>;
  mget: (...args: any[]) => Promise<any>;
  mdel: (...args: any[]) => Promise<any>;
  reset: (cb?: any) => Promise<any>;
  keys: (pattern: string, cb?: any) => Promise<any>;
  ttl: (key: any, cb?: any) => Promise<any>;
}
