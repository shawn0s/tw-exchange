import { Injectable, Logger } from '@nestjs/common';
import { FetchService } from 'src/fetch/fetch.service';
import{ rawData} from './raw-data';
import { Stock } from './stock.schema';

const logger = new Logger('StockService');

@Injectable()
export class StockService {

    constructor(private fetchService: FetchService) {}

    async syncOtcStock(){
        const {aaData, reportDate} = rawData
        // logger.debug(rawData.reportDate);
        let stocks: Array<Stock> = aaData.map(data=>{
            let stock: Stock= new Stock();
            stock.stockNo = data[0];
            stock.stockName = data[1];
            stock.close = parseFloat(data[2].replace(',',''));
            stock.diff = parseFloat(data[3].replace(',+-',''));
            stock.open = parseFloat(data[4].replace(',',''));
            stock.high = parseFloat(data[5].replace(',',''));
            stock.low = parseFloat(data[6].replace(',',''));
            stock.avg = parseFloat(data[7].replace(',',''));
            stock.volume = parseInt(data[8].replace(',',''));
            stock.amount = parseFloat(data[9].replace(',',''));
            stock.stockShares = parseInt(data[15].replace(',',''));
            stock.stockDate = ''
            // stock.date = data[0];
            // stock.change = data[0];
            // stock.peRatio = data[0];
            // stock.ma5 = data[0];
            // stock.ma20 = data[0];
            // stock.ma60 = data[0];
            // stock.ma120 = data[0];
            return stock;
        });
        logger.debug(JSON.stringify(stocks));
    }


}
