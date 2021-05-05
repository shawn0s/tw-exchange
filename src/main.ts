import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FetchService } from './fetch/fetch.service';
import { StockService } from './stock/stock.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const stockService = app.get(StockService);
  const logger = new Logger('main');
  const now = new Date();
  // const fetchService = app.get(FetchService);
  // await fetchService.fetchtpexOTCStock();
  // let startDate= now.toISOString().substring(0,10);
  // let endDate= now.toISOString().substring(0,10);
  // logger.debug(`endDate `+ endDate);
  // let startArr = startDate.split('-');
  // let endArr = endDate.split('-');

  // let startTime = new Date(parseInt(startArr[0]), parseInt(startArr[1])-1, parseInt(startArr[2]),13,30);
  // let endTime = new Date(parseInt(endArr[0]), parseInt(endArr[1])-1, parseInt(endArr[2]),13,30);

  // while(startTime.getTime()<= endTime.getTime()){
  //   logger.debug(`startTime `+ startTime);
  //   let queryDate: string = startTime.toISOString().substring(0, 10);
  //   logger.debug(`queryDate `+ queryDate);
  //   startTime.setDate(startTime.getDate()+1); 
  //   logger.debug(`startTime `+ startTime);

  //   await stockService.syncStock(queryDate)
  //   await stockService.syncOtcStock(queryDate)

  //   await sleep(2000);

  //   await stockService.syncStock3instiAmount(queryDate)
  //   await stockService.syncOTC3instiAmount(queryDate)

  // }

  

  
  await app.listen(3000);
  // await app.close();
}
bootstrap();

