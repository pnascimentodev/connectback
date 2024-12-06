import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSaleDto } from './sale.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

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
