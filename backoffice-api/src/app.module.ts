import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [CustomerModule, PrismaModule, PlanModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
