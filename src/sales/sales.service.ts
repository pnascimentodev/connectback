import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSaleDto } from './sale.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Sales') // Tag for the Sale endpoints
@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

  @ApiOperation({ summary: 'Get all sales with optional filters' })
  @ApiResponse({ status: 200, description: 'List of sales' })
  @ApiResponse({ status: 404, description: 'No sales found' })
  async getAll(productId?: string, startDate?: Date, endDate?: Date) {
    return this.prisma.sale.findMany({
      where: {
        productId,
        ...(startDate &&
          endDate && {
            saleDate: { gte: startDate, lte: endDate },
          }),
      },
    });
  }

  @ApiOperation({ summary: 'Create a new sale' })
  @ApiResponse({ status: 201, description: 'Sale successfully created' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Not enough stock available' })
  @ApiBody({ type: CreateSaleDto })
  async create(data: CreateSaleDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < data.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    const totalValue = product.price * data.quantity;

    const sale = await this.prisma.sale.create({
      data: {
        ...data,
        totalValue,
      },
    });

    await this.prisma.product.update({
      where: { id: data.productId },
      data: { stock: product.stock - data.quantity },
    });

    return sale;
  }

  @ApiOperation({ summary: 'Delete a sale' })
  @ApiResponse({ status: 200, description: 'Sale successfully deleted' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  async delete(id: string) {
    const sale = await this.prisma.sale.findUnique({ where: { id } });
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: sale.productId },
    });
    if (product) {
      await this.prisma.product.update({
        where: { id: sale.productId },
        data: { stock: product.stock + sale.quantity },
      });
    }

    return this.prisma.sale.delete({ where: { id } });
  }
}
