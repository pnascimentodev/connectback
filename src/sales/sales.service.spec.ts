import { Test, TestingModule } from '@nestjs/testing';
import { SaleService } from './sales.service';
import { PrismaService } from '../prisma/prisma.service'; // Importando o PrismaService

// Mock do PrismaService
const prismaServiceMock = {
  sale: {
    findMany: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({
      id: '1',
      productId: 'product-id',
      quantity: 1,
      totalValue: 100,
      saleDate: new Date(),
    }),
    findUnique: jest.fn().mockResolvedValue({
      id: '1',
      productId: 'product-id',
      quantity: 1,
      totalValue: 100,
      saleDate: new Date(),
    }),
    delete: jest.fn().mockResolvedValue({
      id: '1',
    }),
  },
  product: {
    findUnique: jest.fn().mockResolvedValue({
      id: 'product-id',
      price: 100,
      stock: 10,
    }),
    update: jest.fn().mockResolvedValue({
      id: 'product-id',
      stock: 9,
    }),
  },
};

describe('SalesService', () => {
  let service: SaleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        { provide: PrismaService, useValue: prismaServiceMock }, // Fornecendo o mock do PrismaService
      ],
    }).compile();

    service = module.get<SaleService>(SaleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all sales', async () => {
    const sales = await service.getAll();
    expect(sales).toEqual([]); // Espera um array vazio, que é o valor mockado
  });

  it('should create a sale', async () => {
    const saleData = {
      productId: 'product-id',
      quantity: 1,
      saleDate: new Date(),
    };
    const sale = await service.create(saleData);
    expect(sale).toHaveProperty('id');
    expect(sale.totalValue).toBe(100); // Preço do produto mockado é 100
  });

  it('should delete a sale', async () => {
    const sale = await service.delete('1');
    expect(sale).toHaveProperty('id', '1');
  });
});
