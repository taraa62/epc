import { IsString, Length } from 'class-validator';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {

  @ApiProperty({ type: String, required: true, description: 'user login', example: 'taraa62' })
  @IsString()
  @Length(2, 30)
  readonly username: string;

  @ApiProperty({ type: String, required: true, description: 'user password', example: '123456789' })
  @IsString()
  @Length(2, 12)
  readonly password: string;
}

export class UserLoginRespDto extends UserDto {
  @ApiProperty({ type: String, required: true, description: 'access token' })
  accessToken: string;
  @ApiProperty({ type: String, required: true, description: 'expire token for client' })
  expireIn: Date;
}
