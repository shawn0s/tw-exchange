import { Controller, Get, HttpStatus, Logger, Param, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { Stock } from './domain/stock';
import { StockService } from './stock.service';

const logger = new Logger('StockController')

@Controller('/stock')
export class StockController {

    constructor(private stockService: StockService){}

    @Get('/stockNo/:stockNo')
    async getStockByStockNo(@Res() res: Response, @Param('stockNo') stockNo: string) {
        logger.log(`stockNo is ${stockNo}`);

        await this.stockService.findByStockNo(stockNo).then(result =>{
            res.status(HttpStatus.OK).json(result);
        })
        .catch(error => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        })
        
    }

    @Get('/3instiRank')
    async findStock3instiSummary(@Res() res: Response, @Query('startDate') startDate: string, @Query('endDate') endDate: string ){
        await this.stockService.findStock3instiRank(startDate, endDate).then(result =>{
            res.status(HttpStatus.OK).json(result);
        })
        .catch(error => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        });
    }

}
