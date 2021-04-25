import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { IUser } from '../interfaces/IUser';


@Entity({ name: 'products' })
export class ProductsEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment', { name: 'id' })
  public id: string;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
  public name: string;

  @Column({ name: 'description', type: 'varchar', length: 5000, nullable: false })
  public description: string;

  @Column({ name: 'price', type: 'integer', nullable: false })
  public price: number;

  @Column({ name: 'createAt', type: 'timestamptz', default: 'now()' })
  public createAt?: Date;

  @ManyToOne(() => UserEntity, (type) => type.products, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user' })
  public user: IUser;


}
