import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserCreateDto } from '../users/dto/user.create.dto';
import { CommonSuccess } from '../app.dto';
import { AuthService } from './auth.service';
import { UserLoginDto, UserLoginRespDto } from '../users/dto/user.login.dto';
import { UserResetPasswordDto } from '../users/dto/user.reset-password.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../utils/user.decorator';
import { IUser } from '../interfaces/IUser';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {
  }

  @Post('register')
  @ApiCreatedResponse({
    description: 'register new user',
  })
  public async register(
    @Body() createUserDto: UserCreateDto,
  ): Promise<CommonSuccess> {
    return this.authService.register(createUserDto);
  }

  @Post('reset')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('Authorization')
  @ApiCreatedResponse({
    description: 'change password',
  })
  public async resetPassword(@User() user: IUser, @Body() dto: UserResetPasswordDto): Promise<CommonSuccess> {
    return await this.authService.resetPassword(user, dto);
  }

  @Post('login')
  @ApiCreatedResponse({
    status: 200,
    description: 'login user',
  })
  public async login(@Body() dto: UserLoginDto): Promise<UserLoginRespDto> {
    return await this.authService.login(dto);
  }

}
