import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FetchService } from 'src/fetch/fetch.service';
import{ rawData} from './raw-data';
import { Stock, StockDocument } from './stock.schema';

const logger = new Logger('StockService');

@Injectable()
export class StockService {

    constructor(private fetchService: FetchService,
        @InjectModel(Stock.name) 
        private stockModel: Model<StockDocument>
    ) {}

    async syncOtcStock(){
        const {aaData, reportDate} = rawData
        let dateArr = reportDate.split('/');
        let date = new Date(parseInt(dateArr[0])+1911,parseInt(dateArr[1])-1,parseInt(dateArr[2]),13,30);
        logger.debug(date);
        logger.debug(rawData.reportDate);
        let stocks: Array<Stock> = aaData.map(data=>{

            let close = data[2].replace(/[+,-]/,'')==null? parseFloat(data[2].replace(/[+,-]/,'')):0;
            let diff = data[3].replace(/[+,-]/,'')==null? parseFloat(data[3].replace(/[+,-]/,'')):0;
            let open = data[4].replace(/[+,-]/,'')==null? parseFloat(data[4].replace(/[+,-]/,'')):0;
            let high = data[5].replace(/[+,-]/,'')==null? parseFloat(data[5].replace(/[+,-]/,'')):0;
            let low = data[6].replace(/[+,-]/,'')==null? parseFloat(data[6].replace(/[+,-]/,'')):0;
            let avg = data[7].replace(/[+,-]/,'')==null? parseFloat(data[7].replace(/[+,-]/,'')):0;
            let volume = data[8].replace(/[+,-]/,'')==null? parseFloat(data[8].replace(/[+,-]/,'')):0;
            let amount = data[9].replace(/[+,-]/,'')==null? parseFloat(data[9].replace(/[+,-]/,'')):0;
            let stockShares = data[15].replace(/[+,-]/,'')==null? parseFloat(data[15].replace(/[+,-]/,'')):0;

            let stock: Stock= new Stock();
            stock.stockNo = data[0];
            stock.stockName = data[1];
            stock.close = close;
            stock.diff = diff;
            stock.open = open;
            stock.high = high;
            stock.low = low;
            stock.avg = avg;
            stock.volume = volume;
            stock.amount = amount;
            stock.stockShares = stockShares;
            stock.date = date;
            stock.stockDate = `${date.getFullYear()}${date.getMonth()<10?'0'+date.getMonth(): date.getMonth()}${date.getDate()<10?'0'+date.getDate(): date.getDate()}`;
            // stock.change = data[0];
            // stock.peRatio = data[0];
            // stock.ma5 = data[0];
            // stock.ma20 = data[0];
            // stock.ma60 = data[0];
            // stock.ma120 = data[0];
            stock.stockType ='OTC';
            return stock;
        });
        logger.debug(JSON.stringify(stocks));
        for (const stock of stocks) {
            this.stockModel.updateOne({stockNo: stock.stockNo, stockDate: stock.stockDate},stock,{upsert:true})
            .then(x=> logger.log(x)).catch(e=> logger.error(e));
        }
        // let res = await this.stockModel.bulkWrite(stocks.map(stock =>({
        //     updateOne: {
        //       filter: { stockNo: stock.stockNo, stockDate: stock.stockDate },
        //       // If you were using the MongoDB driver directly, you'd need to do
        //       // `update: { $set: { title: ... } }` but mongoose adds $set for
        //       // you.
        //       update: stock,
        //       upsert: true
        //     }
        //   }))).catch(e=> logger.error(e));
        // logger.debug(res);
        
    }


}
