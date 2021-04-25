import { HttpException, HttpStatus } from '@nestjs/common';

export class PasswordsMatchException extends HttpException {

  constructor() {
    super('Passwords match', HttpStatus.BAD_REQUEST);
  }
}


