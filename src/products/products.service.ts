import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsEntity } from './products.entity';
import { IUser } from '../interfaces/IUser';
import { ProductCreateDto, ProductDto, ProductEditDto } from './products.dto';
import { CommonResponse, CommonSuccess } from '../app.dto';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductsEntity)
    private readonly repository: Repository<ProductsEntity>,
  ) {
  }

  public getAll(from: number, size: number): Promise<ProductsEntity[]> {
    return this.transToError(
      this.repository.createQueryBuilder('p')
        .leftJoinAndSelect('users', 'u', 'p."user"=u."uuid"')
        .take(size)
        .skip(from)
        .select(['p', 'u'])
        .getMany(),
    );
  }


  public getOne(id: number): Promise<ProductsEntity> {
    return this.transToError(
      this.repository.createQueryBuilder('p')
        .leftJoinAndSelect('p.user', 'u')
        .where('p.id = :id', { id })
        .select(['p', 'u.username', 'u.firstname', 'u.lastname', 'u.uuid'])
        .getOne(),
    );
  }

  public createProduct(user: IUser, dto: ProductDto): Promise<CommonResponse> {
    const entity: ProductCreateDto = {
      ...dto,
      user,
    };
    return this.transToCommon(this.repository.create(entity).save());
  }

  public editProduct(user: IUser, dto: ProductEditDto) {
    const { id, ...updParam } = dto;
    return this.transToCommon(
      this.repository.createQueryBuilder()
        .update(ProductsEntity)
        .set(updParam)
        .where('id = :id', { id: dto.id })
        .andWhere('user = :own', { own: user.uuid })
        .execute());
  }

  public deleteProduct(user: IUser, id: number) {
    return this.transToCommon(
      this.repository.createQueryBuilder()
        .delete()
        .where('user=:uuid', { uuid: user.uuid })
        .andWhere('id=:id', { id })
        .execute(),
    );
  }

  private transToError<T>(promise: Promise<T>): Promise<T> {
    return promise
      .catch(er => {
        console.error(er);
        throw new InternalServerErrorException();
      });
  }

  private transToCommon<T>(promise: Promise<T>): Promise<CommonResponse> {
    return promise
      .then(() => CommonSuccess.get())
      .catch(er => {
        console.error(er);
        throw new InternalServerErrorException();
      });
  }
}
