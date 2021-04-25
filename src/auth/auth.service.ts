import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserCreateDto } from '../users/dto/user.create.dto';
import { UserService } from '../users/user.service';
import { UserLoginDto, UserLoginRespDto } from '../users/dto/user.login.dto';
import { IUser, JwtUserPayload } from '../interfaces/IUser';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { CommonSuccess } from '../app.dto';
import { UserResetPasswordDto } from '../users/dto/user.reset-password.dto';
import { PasswordsMatchException } from '../http-errors/PasswordsMatchException';
import { InvalidTokenException } from '../http-errors/InvalidTokenException';

@Injectable()
export class AuthService {

  constructor(
    private readonly conf: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
  }

  public register(userDto: UserCreateDto): Promise<CommonSuccess> {
    return this.userService.create(userDto).then(() => CommonSuccess.get());
  }

  public async login(dto: UserLoginDto): Promise<UserLoginRespDto> {
    const user: IUser = await this.userService.findByPassword(dto.username, dto);
    user.password = undefined;
    user.createAt = undefined;

    const expireIn = new Date();
    expireIn.setMinutes(expireIn.getMinutes() + this.conf.get('JWT_TOKEN_EXPIRE'));

    const accessToken = this.jwtService.sign({
      ...user,
    }, {
      secret: this.conf.get('JWT_SECRET_KEY'),
      expiresIn: expireIn.getTime(),
    });
    return plainToClass(UserLoginRespDto, {
      ...user, accessToken, expireIn,
    });
  }

  public async resetPassword(user: IUser, dto: UserResetPasswordDto) {
    if (dto.password === dto.newPassword) {
      throw new PasswordsMatchException();
    }
    return this.userService.resetPassword(user, dto).then(v => {
      if (v.affected > 0) {
        return CommonSuccess.get();
      }
      throw new InternalServerErrorException();
    });
  }

  public async validateUser(payload: JwtUserPayload): Promise<IUser> {
    const user = await this.userService.findByUUID(payload.uuid);
    if (!user) {
      throw new InvalidTokenException();
    }
    return user;
  }
}
