import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

//Create

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The price of the product', example: 1099.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'The description of the product' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 30,
  })
  @IsNumber()
  stock: number;
}

// Update

export class UpdateProductDto {
  @ApiProperty({ description: 'The name of the product', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The description of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The price of the product', required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'The stock quantity of the product',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  stock?: number;
}
