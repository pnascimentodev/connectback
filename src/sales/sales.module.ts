import { Module } from '@nestjs/common';
import { SaleService } from './sales.service';
import { SaleController } from './sales.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SaleService],
  controllers: [SaleController],
})
export class SalesModule {}
