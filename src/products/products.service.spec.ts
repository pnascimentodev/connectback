import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

// Mock implementation of PrismaService for testing purposes
const prismaServiceMock = {
  product: {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue({
      // Mock the findUnique method
      id: '1',
      name: 'Product',
      price: 100,
      description: 'A new product',
      stock: 50,
    }),
    create: jest.fn().mockResolvedValue({
      // Mock the create method
      id: '1',
      name: 'Product',
      price: 100,
      description: 'A new product', // Added description
      stock: 50,
    }),
    update: jest.fn().mockResolvedValue({
      // Mock the update method
      id: '1',
      name: 'Updated Product',
      price: 150,
      description: 'Updated description',
      stock: 40,
    }),
    delete: jest.fn().mockResolvedValue({
      // Mock the delete method
      id: '1',
    }),
  },
};

describe('ProductsService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an empty list of products', async () => {
    // Clarify expectation
    const products = await service.getAll();
    expect(products).toEqual([]);
  });

  it('should create a new product', async () => {
    const productData = {
      name: 'Product',
      price: 100,
      description: 'A new product',
      stock: 50,
    };
    const product = await service.create(productData);
    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Product');
  });

  it('should delete a product by ID', async () => {
    // Clarify operation
    const product = await service.delete('1');
    expect(product).toHaveProperty('id', '1');
  });
});
