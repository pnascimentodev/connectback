import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty({ description: 'The product ID associated with the sale' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'The quantity of the product being sold' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
