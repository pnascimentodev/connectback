import { Test, TestingModule } from '@nestjs/testing';
import { SaleService } from './sales.service';
import { PrismaService } from '../prisma/prisma.service';

// Mock implementation of PrismaService for testing purposes
const prismaServiceMock = {
  sale: {
    findMany: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({
      // Mock the create method
      id: '1',
      productId: 'product-id',
      quantity: 1,
      totalValue: 100,
      saleDate: new Date(),
    }),
    findUnique: jest.fn().mockResolvedValue({
      // Mock the findUnique method
      id: '1',
      productId: 'product-id',
      quantity: 1,
      totalValue: 100,
      saleDate: new Date(),
    }),
    delete: jest.fn().mockResolvedValue({
      // Mock the delete method
      id: '1',
    }),
  },
  product: {
    findUnique: jest.fn().mockResolvedValue({
      // Mock the findUnique method
      id: 'product-id',
      price: 100,
      stock: 10,
    }),
    update: jest.fn().mockResolvedValue({
      // Mock the update method
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
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<SaleService>(SaleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an empty list of sales', async () => {
    // Clarify expectation
    const sales = await service.getAll();
    expect(sales).toEqual([]);
  });

  it('should create a new sale and update product stock', async () => {
    // Clarify operation
    const saleData = {
      productId: 'product-id',
      quantity: 1,
      saleDate: new Date(),
    };
    const sale = await service.create(saleData);

    // Assertions
    expect(sale).toHaveProperty('id');
    expect(sale.totalValue).toBe(100);
    expect(prismaServiceMock.product.update).toHaveBeenCalledWith({
      where: { id: 'product-id' },
      data: { stock: 9 },
    });
  });

  it('should delete a sale', async () => {
    // Clarify operation
    const sale = await service.delete('1');
    expect(sale).toHaveProperty('id', '1');
  });
});
