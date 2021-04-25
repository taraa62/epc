import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsEntity } from './products.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductDto, ProductEditDto, ProductsListDto } from './products.dto';
import { CommonResponse } from '../app.dto';
import { User } from '../utils/user.decorator';
import { IUser } from '../interfaces/IUser';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('products')
@Controller('products')
export class ProductsController {

  constructor(
    private readonly service: ProductsService,
  ) {
  }

  @Get('/')
  @ApiResponse({ type: ProductsListDto, isArray: true, description: 'all products of users' })
  public getAll(@Query('from', ParseIntPipe) from: number,
                @Query('size', ParseIntPipe) size: number,
  ): Promise<ProductsEntity[]> {
    return this.service.getAll(from, size);
  }

  @Get('/:id')
  @ApiResponse({ type: ProductsListDto, isArray: true, description: 'get product' })
  public getOne(@Param('id', ParseIntPipe) id: number): Promise<ProductsEntity> {
    return this.service.getOne(id);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('Authorization')
  @ApiResponse({ type: ProductsListDto, isArray: true, description: 'create new product' })
  public createProduct(@User() user: IUser, @Body() dto: ProductDto): Promise<CommonResponse> {
    return this.service.createProduct(user, dto);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('Authorization')
  @ApiResponse({ type: ProductsListDto, isArray: true, description: 'edit product' })
  public editProduct(@User() user: IUser, @Body() dto: ProductEditDto): Promise<CommonResponse> {
    return this.service.editProduct(user, dto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('Authorization')
  @ApiResponse({ type: ProductsListDto, isArray: true, description: 'delete product' })
  public deleteProduct(@User() user: IUser, @Param('id', ParseIntPipe) id: number): Promise<CommonResponse> {
    return this.service.deleteProduct(user, id);
  }
}
