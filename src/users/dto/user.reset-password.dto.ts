import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserResetPasswordDto {

  @ApiProperty({ type: String, required: true, description: 'user password', example: '123456789' })
  @IsString()
  @Length(2, 12)
  readonly password: string;

  @ApiProperty({ type: String, required: true, description: 'new user password', example: '987654321' })
  @IsString()
  @Length(2, 12)
  readonly newPassword: string;
}
