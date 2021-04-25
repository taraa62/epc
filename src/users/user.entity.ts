import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '../interfaces/IUser';
import { ProductsEntity } from '../products/products.entity';


@Entity({ name: 'users' })
export class UserEntity extends BaseEntity implements IUser {

  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  public uuid: string;

  @Column({ name: 'username', type: 'varchar', length: 100, nullable: false })
  public username: string;

  @Column({ name: 'firstname', type: 'varchar', length: 30, nullable: false })
  public firstname: string;

  @Column({ name: 'lastname', type: 'varchar', length: 30, nullable: false })
  public lastname: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  public password: string;

  @Column({ name: 'createAt', type: 'timestamptz', default: 'now()' })
  public createAt: Date;


  @OneToMany(() => ProductsEntity, type => type.user, {
    onDelete: 'NO ACTION',
  })
  public products: ProductsEntity[];
}
