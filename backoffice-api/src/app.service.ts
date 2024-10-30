import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private users = [{ id: 1, name: 'User 1' }];

  findAll() {
    return this.users;
  }
}
