import { ApiProperty } from '@nestjs/swagger';

export type CommonResponse = CommonSuccess | CommonError;

export class CommonSuccess {
  @ApiProperty({ type: String, required: true, example: 'ok' })
  status: 'ok';

  // @ApiProperty({type: String, required: true, example: '{} | []'})
  [property: string]: {} | [];

  static get() {
    return <CommonSuccess>{ status: 'ok' };
  }

  static getEmptyArray() {
    return <CommonSuccess>{ status: 'ok', data: [] };
  }

  static getEmptyObject(property: keyof CommonSuccess) {
    return <CommonSuccess>{ [property]: {} };
  }

  static getWithParam(property: keyof CommonSuccess, value: unknown) {
    return <CommonSuccess>{ status: 'ok', [property]: value };
  }
}


export type TCommonError = string | Error | string[] | Error[];

export class CommonError {
  @ApiProperty({ type: String, required: true, example: 'ok' })
  status: 'error';

  @ApiProperty({ required: true, example: '"something was wrong"' })
  message: TCommonError;

  static get(error: TCommonError) {
    const msg = (typeof error === 'string') ? error : Array.isArray(error) ? error[0] : error.message;

    return <CommonError>{ status: 'error', message: msg };
  }
}
