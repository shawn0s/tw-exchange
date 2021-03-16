import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FetchService } from './fetch/fetch.service';
import { StockService } from './stock/stock.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // const fetchService = app.get(FetchService);
  // await fetchService.fetchtpexOTCStock();
  let startdate= `2021-03-16`//new Date()toISOString().substring(0,10);
  const stockService = app.get(StockService);

  await stockService.syncStock(startdate).then(async res=>{
    await stockService.syncStock3instiAmount(startdate)
  });
  
  await stockService.syncOtcStock(startdate).then(async res=>{
    await stockService.syncOTC3instiAmount(startdate)
  });
  
  await app.close();
}
bootstrap();
