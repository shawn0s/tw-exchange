import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FetchService } from 'src/fetch/fetch.service';
import{ rawData, stockData, stockT86} from './raw-data';
import { Stock, StockDocument } from './stock.schema';
import fs from 'fs';
import { exception } from 'node:console';

const logger = new Logger('StockService');

@Injectable()
export class StockService {

    constructor(private fetchService: FetchService,
        @InjectModel(Stock.name) 
        private stockModel: Model<StockDocument>
    ) {}

    

    async syncOtcStock(startDate: string){
        const fetchData = await this.fetchService.fetchtpexOTCStock(startDate);//rawData;
        let {aaData, reportDate}  = fetchData;
        let dateArr = reportDate.split('/');
        let date = new Date(parseInt(dateArr[0])+1911,parseInt(dateArr[1])-1,parseInt(dateArr[2]),13,30);
        logger.debug(date);
        logger.debug(reportDate);
        let stocks: Array<Stock> = aaData.map(data=>{

            let stock: Stock= new Stock();
            stock.stockNo = data[0];
            stock.stockName = data[1];
            stock.close = this.stringToFloat(data[2]);
            stock.change = this.stringToFloat(data[3]);
            stock.open = this.stringToFloat(data[4]);
            stock.high = this.stringToFloat(data[5]);
            stock.low = this.stringToFloat(data[6]);
            stock.volume = this.stringToFloat(data[7]);
            stock.amount = this.stringToFloat(data[8]);
            stock.avg = Math.round(((stock.high+stock.low)/2)*100)/100;
            
            
            stock.stockShares = this.stringToFloat(data[14]);
            stock.date = date;
            stock.stockDate = date.toISOString().substring(0, 10).split('-').join('');
            stock.diff = Math.round((stock.high- stock.low)*100)/100;
            stock.stockType ='OTC';
            if('除息'==data[3]){
                stock.excludeD= true;
            }
            // stock.peRatio = data[0];
            // stock.ma5 = data[0];
            // stock.ma20 = data[0];
            // stock.ma60 = data[0];
            // stock.ma120 = data[0];
            
            // if(stock.change==null){
            //     logger.debug(JSON.stringify(stock));
            // }
            
            return stock;
        });

        // for (let index = 0; index < stocks.length; index++) {
        //     const stock = stocks[index];
        //     // logger.debug(JSON.stringify(stock));
        //     await this.stockModel.updateOne({stockNo: stock.stockNo, stockDate: stock.stockDate},stock,{upsert:true}).catch(error=>{
        //         logger.error(JSON.stringify(stock));
        //         logger.error(error);
        //     });
        // }
        
        await this.stockModel.bulkWrite(stocks.map(stock =>({
            updateOne: {
              filter: { stockNo: stock.stockNo, stockDate: stock.stockDate },
              update: stock,
              upsert: true
            }
          })))
          .then(res => {
              logger.debug(JSON.stringify(res))
            }).catch(e=> logger.error(e));

        return 'success';
    }

    async syncOTC3instiAmount(startDate: string){
        let strArr = startDate.split('-');
        let mm = parseInt(strArr[1])<10? '0'+ parseInt(strArr[1]):parseInt(strArr[1]);
        let dd = parseInt(strArr[2])<10? '0'+ parseInt(strArr[2]):parseInt(strArr[2]);
        let reqDate = `${parseInt(strArr[0])-1911}/${mm}/${dd}`;
        logger.log(reqDate);
        let apiUri = `https://www.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?l=zh-tw&se=EW&t=D&d=${reqDate}&_=${new Date().getTime()}`;
        logger.log(apiUri);
        let fetchData = await this.fetchService.fetchData(apiUri);
        let {aaData, reportDate}  = fetchData.data;
        let dateArr = reportDate.split('/');
        let date = new Date(parseInt(dateArr[0])+1911,parseInt(dateArr[1])-1,parseInt(dateArr[2]),13,30);
        let dateStr = date.toISOString().substring(0,10).split('-').join('');
        logger.debug(dateStr);
        let stMap = new Map();

        let stocks: Array<StockDocument> = await this.stockModel.find({ stockDate: dateStr, stockType:'OTC' });
        for (const stock of stocks) {
            stMap.set(stock.stockNo, stock);
        }
        let stockList: Array<Stock> = aaData.filter(rawdata=> stMap.has(rawdata[0])).map(rawdata=>{
            let stock :StockDocument = stMap.get(rawdata[0]);
            stock.foreignBuy =this.stringToFloat(rawdata[2]);
            stock.foreignSell = this.stringToFloat(rawdata[3]);
            stock.foreignTotal = this.stringToFloat(rawdata[4]);
            stock.foreignTotalAmount= Math.round((stock.foreignTotal*stock.avg)*100)/100;
            stock.dealerBuy=this.stringToFloat(rawdata[20]);
            stock.dealerSell=this.stringToFloat(rawdata[21]);
            stock.dealerTotal=this.stringToFloat(rawdata[22]);
            stock.dealerTotalAmount= Math.round((stock.dealerTotal*stock.avg)*100)/100;
            stock.fundBuy=this.stringToFloat(rawdata[11]);
            stock.fundSell=this.stringToFloat(rawdata[12]);
            stock.fundTotal=this.stringToFloat(rawdata[13]);
            stock.fundTotalAmount= Math.round((stock.fundTotal*stock.avg)*100)/100;
            // logger.debug(stock);
            return stock;
        });


        // for (let index = 0; index < stockList.length; index++) {
        //     const stock = stocks[index];
        //     // logger.debug(JSON.stringify(stock));
        //     await this.stockModel.updateOne({_id: stock.id},stock,{upsert:false}).catch(error=>{
        //         logger.error(JSON.stringify(stock));
        //         logger.error(error);
        //     });
        // }

        await this.stockModel.bulkWrite(stockList.map(stock =>({
            updateOne: {
              filter: {_id: stock.id},
              update: { foreignBuy: stock.foreignBuy,
                foreignSell: stock.foreignSell,
                foreignTotal: stock.foreignTotal,
                foreignTotalAmount: stock.foreignTotalAmount,
                dealerBuy: stock.dealerBuy,
                dealerSell: stock.dealerSell,
                dealerTotal: stock.dealerTotal,
                dealerTotalAmount: stock.dealerTotalAmount,
                fundBuy: stock.fundBuy,
                fundSell: stock.fundSell,
                fundTotal: stock.fundTotal,
                fundTotalAmount: stock.fundTotalAmount,
              }
            }
          })))
          .then(res => {
              logger.debug(JSON.stringify(res))
            }).catch(e=> logger.error(e));

        return
    }


    async syncStock(startDate: string){
        let strArr = startDate.split('-');
        let reqDate = startDate.split('-').join('');
        logger.log(reqDate);
        // ''
        let apiUri = `https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=${reqDate}&type=ALLBUT0999&_=${new Date().getTime()}`;
        // `https://www.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?l=zh-tw&se=EW&t=D&d=${reqDate}&_=${new Date().getTime()}`;
        logger.log(apiUri);
        let fetchData = await this.fetchService.fetchData(apiUri);
        // logger.log(JSON.stringify(fetchData.data));
        let { data9} = fetchData.data;

        let stocks: Array<Stock> = data9.map(data => {
            let stock: Stock= new Stock();
            stock.stockNo = data[0];
            stock.stockName = data[1];
            stock.volume = this.stringToFloat(data[2]);
            stock.count = this.stringToFloat(data[3]);
            stock.amount = this.stringToFloat(data[4]);
            stock.open = this.stringToFloat(data[5]);
            stock.high = this.stringToFloat(data[6]);
            stock.low = this.stringToFloat(data[7]);
            stock.close = this.stringToFloat(data[8]);
            let negative = data[9].match(/green/i)? -1: 1;
            // if(negative){
            //     logger.log(`stock ${stock.stockNo} ${ stock.stockName }`+ negative);
            // }
            
            stock.change = this.stringToFloat(data[10]) * negative;
            // stock.stockShares = this.stringToFloat(data[14]);
            stock.date = new Date(parseInt(strArr[0]),parseInt(strArr[1])-1,parseInt(strArr[2]),13,30);
            stock.stockDate = reqDate;
            stock.diff = Math.round((stock.high- stock.low)*100)/100;
            stock.stockType ='twse';
            stock.peRatio =this.stringToFloat(data[15]);
            stock.avg = Math.round(((stock.high+stock.low)/2)*100)/100;
            // logger.log(`stock ${JSON.stringify(stock)}`);
            return stock;
        })

        await this.stockModel.bulkWrite(stocks.map(stock =>({
            updateOne: {
              filter: { stockNo: stock.stockNo, stockDate: stock.stockDate },
              update: stock,
              upsert: true
            }
          })))
          .then(res => {
              logger.debug(JSON.stringify(res))
            }).catch(e=> logger.error(e));
    }

    async syncStock3instiAmount(startDate: string){
        let strArr = startDate.split('-');
        let reqDate = startDate.split('-').join('');
        logger.log(reqDate);
        let apiUri = `https://www.twse.com.tw/fund/T86?response=json&date=${reqDate}&selectType=ALLBUT0999&_=1615908749350`;
        // `https://www.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?l=zh-tw&se=EW&t=D&d=${reqDate}&_=${new Date().getTime()}`;
        logger.log(apiUri);
        let fetchData = await this.fetchService.fetchData(apiUri);
        // logger.log(JSON.stringify(fetchData.data));
        let { data } = fetchData.data;
        let stMap = new Map();
        let stocks: Array<StockDocument> = await this.stockModel.find({ stockDate: reqDate, stockType:'twse' });
        for (const stock of stocks) {
            stMap.set(stock.stockNo, stock);
        }

        let stockList: Array<Stock> = data.filter(rawdata=> stMap.has(rawdata[0])).map(rawdata=>{
            let stock :StockDocument = stMap.get(rawdata[0]);
            stock.foreignBuy =this.stringToFloat(rawdata[2]);
            stock.foreignSell = this.stringToFloat(rawdata[3]);
            stock.foreignTotal = this.stringToFloat(rawdata[4]);
            stock.foreignTotalAmount= Math.round((stock.foreignTotal*stock.avg)*100)/100;
            stock.dealerBuy=this.stringToFloat(rawdata[12])+ this.stringToFloat(rawdata[15]);
            stock.dealerSell=this.stringToFloat(rawdata[13])+ this.stringToFloat(rawdata[16]);
            stock.dealerTotal=this.stringToFloat(rawdata[11]);
            stock.dealerTotalAmount= Math.round((stock.dealerTotal*stock.avg)*100)/100;
            stock.fundBuy=this.stringToFloat(rawdata[8]);
            stock.fundSell=this.stringToFloat(rawdata[9]);
            stock.fundTotal=this.stringToFloat(rawdata[10]);
            stock.fundTotalAmount= Math.round((stock.fundTotal*stock.avg)*100)/100;
            // logger.debug(stock);
            return stock;
        });

        await this.stockModel.bulkWrite(stockList.map(stock =>({
            updateOne: {
              filter: {_id: stock.id},
              update: { foreignBuy: stock.foreignBuy,
                foreignSell: stock.foreignSell,
                foreignTotal: stock.foreignTotal,
                foreignTotalAmount: stock.foreignTotalAmount,
                dealerBuy: stock.dealerBuy,
                dealerSell: stock.dealerSell,
                dealerTotal: stock.dealerTotal,
                dealerTotalAmount: stock.dealerTotalAmount,
                fundBuy: stock.fundBuy,
                fundSell: stock.fundSell,
                fundTotal: stock.fundTotal,
                fundTotalAmount: stock.fundTotalAmount,
              }
            }
          })))
          .then(res => {
              logger.debug(JSON.stringify(res))
            }).catch(e=> logger.error(e));

        return 
    }

    stringToFloat(value: string){
        let result = 0;
        // let count =value.match(/-/g)
        const regex = /[+]/ig;
        value = value.replace(regex,'').split(',').join('');
        let value1: number = parseFloat(value);
        result =value1? Math.round(value1 *100)/100: 0;
        // if(count && count.length>1){
        //     // logger.log(count.length);
        // }else{
            
        // }
        return result;
    }

    


}
