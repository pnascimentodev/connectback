import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma/prisma.service'; // Caminho corrigido
import { SaleService } from './sales/sales.service';

describe('SalesService', () => {
  let service: SaleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaleService, PrismaService], // Adicione o PrismaService como provedor
    }).compile();

    service = module.get<SaleService>(SaleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
