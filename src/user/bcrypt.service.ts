import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly saltRounds = 10;
  async generateHash(password: string) {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
