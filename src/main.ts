import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FetchService } from './fetch/fetch.service';
import { StockService } from './stock/stock.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  // const fetchService = app.get(FetchService);
  // await fetchService.fetchtpexOTCStock();

  const stockService = app.get(StockService);
  stockService.syncOtcStock();
  await app.close();
}
bootstrap();
