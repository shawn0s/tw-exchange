import { HttpService, Injectable,Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import https from 'https';
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

    async fetchtpexOTCStock(){
        let response = null;
        let url = `https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes_no1430/stk_wn1430_result.php?l=zh-tw&d=110/03/09&se=EW`;
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
}
