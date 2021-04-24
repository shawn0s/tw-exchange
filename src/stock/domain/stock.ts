export class Stock{
    constructor(){}
    id: string;
    stockNo: string;
    stockDate: string;
    stockName: string;
    stockShares: number; //成交股數
    volume: number; //成交股數
    count: number; //成交筆數
    amount: number; //成交金額
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    diff: number;
    change: number;
    peRatio: number;
    ma5: number;
    ma20: number;
    ma60: number;
    ma120: number;
    avg: number;
    stockType: string;
    excludeD: boolean;
    excludeR: boolean;
    foreignBuy: number;
    foreignSell: number;
    foreignTotal: number;
    foreignTotalAmount: number;
    dealerBuy: number;
    dealerSell: number;
    dealerTotal: number;
    dealerTotalAmount: number;
    fundBuy: number;
    fundSell: number;
    fundTotal: number;
    fundTotalAmount: number;
}
