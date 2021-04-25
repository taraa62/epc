import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserModel } from './user.model';
import { ExistUserException } from '../http-errors/ExistUserException';
import { IUser } from '../interfaces/IUser';
import { UserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { UserCreateDto } from './dto/user.create.dto';
import { UserLoginDto } from './dto/user.login.dto';
import { UserNotFoundException } from '../http-errors/UserNotFoundException';
import * as bcrypt from 'bcrypt';
import { InvalidCredentialsException } from '../http-errors/InvalidCredentialsException';
import { UserResetPasswordDto } from './dto/user.reset-password.dto';
import { UpdateResult } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    private readonly model: UserModel,
  ) {
  }

  public async create(dto: UserCreateDto): Promise<UserDto> {
    const existUser = await this.model.findByName(dto.username);
    if (existUser) {
      throw new ExistUserException();
    }
    const user: IUser = await this.model.create(dto);
    const { password, ...reFields } = user;
    return plainToClass(UserDto, reFields);
  }

  public findByUUID(uuid: string): Promise<IUser> {
    return this.model.findByUUID(uuid);
  }

  public async findByPassword(username: string, dto: UserLoginDto | UserResetPasswordDto): Promise<IUser> {
    const existUser = await this.model.findByName(username);
    if (!existUser) {
      throw new UserNotFoundException();
    }
    const isCompare = await bcrypt.compare(dto.password, existUser.password);
    if (!isCompare) {
      throw new InvalidCredentialsException();
    }
    return existUser;
  }

  public async resetPassword(user: IUser, dto: UserResetPasswordDto): Promise<UpdateResult> {
    const existUser = await this.findByPassword(user.username, dto);
    return this.model.updatePassword(existUser.uuid, dto.newPassword).catch(er => {
      console.error(er);
      throw new InternalServerErrorException();
    });
  }
}
