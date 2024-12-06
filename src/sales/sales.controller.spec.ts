import { Test, TestingModule } from '@nestjs/testing';
import { SaleController } from './sales.controller';
import { SaleService } from './sales.service';
import { PrismaService } from '../prisma/prisma.service'; // Adicionando a importação do PrismaService

// Mock do PrismaService
const prismaServiceMock = {
  sale: {
    // Mock de métodos que o SaleService vai usar, como findMany, create, etc.
    findMany: jest.fn().mockResolvedValue([]), // Exemplo de mock de findMany
  },
};

describe('SalesController', () => {
  let controller: SaleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleController],
      providers: [
        SaleService,
        { provide: PrismaService, useValue: prismaServiceMock }, // Fornecendo o mock do PrismaService
      ],
    }).compile();

    controller = module.get<SaleController>(SaleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
