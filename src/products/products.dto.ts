import { IUser } from '../interfaces/IUser';
import { IsInt, IsString, Length } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @IsString()
  @Length(1, 100)
  @ApiProperty({ type: String, description: 'Name of product', example: 'product 1' })
  public name: string;

  @IsString()
  @Length(1, 5000)
  @ApiProperty({ type: String, description: 'Description of product', example: 'this is a product 1' })
  public description: string;

  @IsInt()
  @ApiProperty({ type: String, description: 'Price of product, value in cents', example: '1000' })
  public price: number;
}

export class ProductsListDto extends ProductDto {
  @ApiProperty({ type: String, description: 'id of product', example: '1' })
  public id: string;

  @ApiProperty({ type: String, description: 'date creation', example: '1' })
  public createAt: Date;

  @ApiProperty({ type: String, description: 'owner of product', example: '1' })
  public user: IUser;
}


export class ProductCreateDto extends ProductDto {
  @ApiHideProperty()
  public user: IUser;
}

export class ProductEditDto extends ProductDto {
  @ApiProperty({ type: String, description: 'id of product', example: '1' })
  @IsInt()
  public id: number;

  @ApiHideProperty()
  public user!: IUser;
}

