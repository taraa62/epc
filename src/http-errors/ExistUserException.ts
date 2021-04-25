import { HttpException, HttpStatus } from '@nestjs/common';

export class ExistUserException extends HttpException {

  constructor() {
    super('User with this login already exists', HttpStatus.BAD_REQUEST);
  }
}
