import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './products.service';
import { PrismaService } from '../prisma/prisma.service'; // Importando o PrismaService

// Mock do PrismaService
const prismaServiceMock = {
  product: {
    findMany: jest.fn().mockResolvedValue([]), // Mockando o método findMany
    findUnique: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Product',
      price: 100,
      description: 'A new product',
      stock: 50,
    }), // Mockando o método findUnique
    create: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Product',
      price: 100,
      description: 'A new product', // Adicionando description
      stock: 50, // Adicionando stock
    }), // Mockando o método create
    update: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Updated Product',
      price: 150,
      description: 'Updated description',
      stock: 40,
    }), // Mockando o método update
    delete: jest.fn().mockResolvedValue({
      id: '1',
    }), // Mockando o método delete
  },
};

describe('ProductsService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: prismaServiceMock }, // Fornecendo o mock do PrismaService
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of products', async () => {
    const products = await service.getAll();
    expect(products).toEqual([]); // Espera um array vazio, como mockado
  });

  it('should create a product', async () => {
    const productData = {
      name: 'Product',
      price: 100,
      description: 'A new product', // Adicionando description
      stock: 50, // Adicionando stock
    };
    const product = await service.create(productData);
    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Product');
  });

  it('should delete a product', async () => {
    const product = await service.delete('1');
    expect(product).toHaveProperty('id', '1');
  });
});
