import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { SaleService } from './sales.service';
import { CreateSaleDto } from './sale.dto';

@ApiTags('Sales') // Tag for grouping related endpoints in Swagger UI
@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all sales with optional filtering by product and date range',
  })
  @ApiResponse({ status: 200, description: 'List of sales' })
  @ApiQuery({
    name: 'productId',
    required: false,
    type: String,
    description: 'Filter sales by product ID',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Filter sales by start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Filter sales by end date (YYYY-MM-DD)',
  })
  getAll(
    @Query('productId') productId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.saleService.getAll(
      productId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new sale' })
  @ApiResponse({ status: 201, description: 'Sale successfully created' })
  @ApiBody({ type: CreateSaleDto, description: 'Sale data to be created' })
  create(@Body() data: CreateSaleDto) {
    return this.saleService.create(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sale by ID' })
  @ApiResponse({ status: 200, description: 'Sale successfully deleted' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  @ApiParam({ name: 'id', type: String, description: 'Sale ID to be deleted' })
  delete(@Param('id') id: string) {
    return this.saleService.delete(id);
  }
}
