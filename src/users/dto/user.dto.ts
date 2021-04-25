import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class UserMainDto {
  @ApiProperty({ type: String, required: true, description: 'user login', example: 'taraa62' })
  @IsString()
  @Length(2, 30)
  username: string;

  @ApiProperty({ type: String, required: true, description: 'user name', example: 'taraa' })
  @IsString()
  @Length(2, 30)
  firstname: string;

  @ApiProperty({ type: String, required: true, description: 'user last name', example: 'last62' })
  @IsString()
  @Length(2, 30)
  lastname: string;
}

export class UserDto extends UserMainDto {

  @ApiProperty({ type: String, required: true, description: 'user id', example: '' })
  public uuid: string;

  @ApiProperty({ type: Date, required: true, description: 'user creation date', example: new Date() })
  public createAt: Date;
}
