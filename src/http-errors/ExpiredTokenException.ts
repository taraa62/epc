import { HttpException, HttpStatus } from '@nestjs/common';

export class ExpiredTokenException extends HttpException {

    constructor() {
        super('The access token has expired', HttpStatus.UNAUTHORIZED);
    }
}
