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
  let startDate= `2020-10-12`//new Date()toISOString().substring(0,10);
  let endDate= '2020-12-31'//`${now.getFullYear()}-${now.getMonth()+1<10? now.getMonth()+1: now.getMonth()}-${now.getDate()}`
  logger.debug(`endDate `+ endDate);
  let startArr = startDate.split('-');
  let endArr = endDate.split('-');

  let startTime = new Date(parseInt(startArr[0]), parseInt(startArr[1])-1, parseInt(startArr[2]),13,30);
  let endTime = new Date(parseInt(endArr[0]), parseInt(endArr[1])-1, parseInt(endArr[2]),13,30);

  while(startTime.getTime()<= endTime.getTime()){
    logger.debug(`startTime `+ startTime);
    let queryDate: string = startTime.toISOString().substring(0, 10);
    logger.debug(`queryDate `+ queryDate);
    startTime.setDate(startTime.getDate()+1); 
    logger.debug(`startTime `+ startTime);

    await stockService.syncStock(queryDate)
    await sleep(1000);
    await stockService.syncOtcStock(queryDate)
    await sleep(1000);

    await stockService.syncStock3instiAmount(queryDate)
    await sleep(1000);
    await stockService.syncOTC3instiAmount(queryDate)
    await sleep(2000);
    
    

  }

  

  
  
  await app.close();
}
bootstrap();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}