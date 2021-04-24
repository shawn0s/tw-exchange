import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockService } from './stock.service';
import { StockSchema } from './stock.schema';
import { FetchModule } from 'src/fetch/fetch.module';
import { StockController } from './stock.controller';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: 'Stock', schema: StockSchema }]),
    FetchModule,
  ],
  providers: [StockService],
  controllers: [StockController]
})
export class StockModule {}
