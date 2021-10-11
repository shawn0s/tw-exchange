import { Controller, Get, HttpStatus, Logger, Param, Res, Query, Header } from '@nestjs/common';
import { Response } from 'express';
import { Stock } from './domain/stock';
import { StockService } from './stock.service';
import { sleep } from '../until'

const logger = new Logger('StockController')

@Controller('/stock')
export class StockController {

    constructor(private stockService: StockService){}

    @Get('/stockNo/:stockNo')
    async getStockByStockNo(@Res() res: Response, @Param('stockNo') stockNo: string) {
        logger.log(`stockNo is ${stockNo}`);

        await this.stockService.findByStockNo(stockNo).then(result =>{
            res.status(HttpStatus.OK).send(result);
        })
        .catch(error => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        })
        
    }

    @Get('/3instiRank')
    async findStock3instiSummary(@Res() res: Response, @Query('startDate') startDate: string, @Query('endDate') endDate: string ){
        await this.stockService.findStock3instiRank(startDate, endDate).then(result =>{
            res.status(HttpStatus.OK).send(result);
        })
        .catch(error => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        });
    }

    @Get('sync')
    @Header('keep-alive', 'timeout=5, max=1000')
    async syncDailyStock(@Res() res: Response, @Query('startDate') startDate: string, @Query('endDate') endDate: string){
        const now = new Date();
        try {
            const startYear: number = startDate ? parseInt(startDate.substring(0,4))  : now.getFullYear();
            const startMonth: number = startDate ? parseInt(startDate.substring(4,6))-1 : now.getMonth();
            const startDay: number = startDate ? parseInt(startDate.substring(6,8)) : now.getDate();
            const endYear: number = endDate ? parseInt(endDate.substring(0,4)) : now.getFullYear();
            const endMonth: number = endDate ? parseInt(endDate.substring(4,6))-1 : now.getMonth();
            const endDay: number = endDate ? parseInt(endDate.substring(6,8)) : now.getDate();
            logger.debug(`startDate ${startYear} ${startMonth} ${startDay}, endDate ${endYear} ${endMonth} ${endDay}`);
            let startTime = new Date(startYear, startMonth, startDay, 13, 30);
            let endTime = new Date(endYear, endMonth, endDay, 13, 30);
            
            while(startTime.getTime()<= endTime.getTime()){
                logger.debug(`startTime `+ startTime);
                let queryDate: string = startTime.toISOString().substring(0, 10);
                logger.debug(`queryDate `+ queryDate);
                startTime.setDate(startTime.getDate()+1); 
                logger.debug(`startTime `+ startTime);

                await this.stockService.syncStock(queryDate)
                await this.stockService.syncOtcStock(queryDate)

                await sleep(2000);

                await this.stockService.syncStock3instiAmount(queryDate)
                await this.stockService.syncOTC3instiAmount(queryDate)

            }
            res.status(HttpStatus.OK).send('ok');
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: error
            })
        }
    }

}
