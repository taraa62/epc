import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { IUser, TUserCreate } from '../interfaces/IUser';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserModel {

  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
  }

  public findByName(username: string): Promise<IUser> {
    return this.repository.findOne({
      where: {
        username,
      },
    });
  }

  public async create(entity: TUserCreate): Promise<IUser> {
    entity.password = await bcrypt.hash(entity.password, 10);
    return this.repository.create(entity).save();
  }

  public async updatePassword(uuid: string, newPassword: string): Promise<UpdateResult> {
    const password = await bcrypt.hash(newPassword, 10);
    return this.repository.update(uuid, {
      password,
    });
  }

  public findByUUID(uuid: string) {
    return this.repository.findOne({
      where: {
        uuid,
      },
    });
  }
}
