import { HttpService, Injectable,Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import https from 'https';
import { Observable } from 'rxjs';
const logger = new Logger();
@Injectable()
export class FetchService {
    constructor(private configService: ConfigService,
        private httpService: HttpService) {}


    async fetchtpex3Insti(){
        let response = null;
        let url = `https://www.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?l=zh-tw&se=EW&t=D&_=1615295870848`;
        let headers= {
            'Accept-Encoding':'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
        };
        // let httpsAgent=  new https.Agent({
        //     rejectUnauthorized: false
        // })
        let result= await this.httpService.get(url,{headers:headers }).toPromise();
        //.subscribe(res => logger.debug(JSON.stringify(res)) );
       logger.debug(JSON.stringify(result.data));
    }

    async fetchtpexOTCStock(startDate: string){
        let response = null;
        let strArr = startDate.split('-');
        let mm = parseInt(strArr[1])<10? '0'+ parseInt(strArr[1]):parseInt(strArr[1]);
        let dd = parseInt(strArr[2])<10? '0'+ parseInt(strArr[2]):parseInt(strArr[2]);
        let date = `${parseInt(strArr[0])-1911}/${mm}/${dd}`;
        logger.log(`date is ${date}`)
        //         https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes_no1430/stk_wn1430_result.php?l=zh-tw&d=110/03/10&se=EW&_=1615392204588
        let url = `https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes_no1430/stk_wn1430_result.php?l=zh-tw&d=${date}&se=EW&_=${new Date().getTime()}`;
        logger.log(`url is ${url}`)
        let headers= {
            'Accept-Encoding':'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
        };
        // let httpsAgent=  new https.Agent({
        //     rejectUnauthorized: false
        // })
        let result= await this.httpService.get(url,{headers:headers }).toPromise();
        //.subscribe(res => logger.debug(JSON.stringify(res)) );
    //    logger.debug(JSON.stringify(result.data));
       return result.data;
    }

    async fetchData(url: string): Promise<any>{
        let headers= {
            'Accept-Encoding':'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
        };

        return await this.httpService.get(url,{headers:headers }).toPromise();
    }
}
