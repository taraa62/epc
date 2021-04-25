import { IsString, Length } from 'class-validator';
import { UserMainDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';


export class UserCreateDto extends UserMainDto {

    @ApiProperty({ type: String, required: true, description: 'user password', example: '123456789' })
    @IsString()
    @Length(8, 30)
    password: string;
}
