import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { PlanModule } from './plan/plan.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    /*CustomerModule, PrismaModule, PlanModule*/
  ],
  controllers: [AppController],
  providers: [/*PrismaService,*/ AppService],
})
export class AppModule {}
