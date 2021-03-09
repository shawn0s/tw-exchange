import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockService } from './stock.service';
import { Stock, StockSchema } from './stock.schema';
import { FetchModule } from 'src/fetch/fetch.module';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
    FetchModule,
  ],
  providers: [StockService]
})
export class StockModule {}
