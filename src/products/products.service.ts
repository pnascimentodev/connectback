import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(name?: string) {
    return this.prisma.product.findMany({
      where: name ? { name: { contains: name, mode: 'insensitive' } } : {},
    });
  }

  async getById(id: string) {
    const product = await this.prisma.product.findMany({
      where: { id },
      take: 1,
    });
    if (product.length === 0) {
      throw new NotFoundException('Product not found');
    }
    return product[0];
  }

  async create(data: CreateProductDto) {
    return this.prisma.product.create({ data });
  }

  async update(id: string, data: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.prisma.product.update({ where: { id }, data });
  }

  async delete(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.prisma.product.delete({ where: { id } });
  }
}
