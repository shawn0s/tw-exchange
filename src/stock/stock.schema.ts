import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type StockDocument = Stock & Document;

export class Stock{
    constructor(){}
    id: string;
    stockNo: string;
    stockDate: string;
    stockName: string;
    stockShares: number; //成交股數
    volume: number; //成交筆數
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

export const StockSchema = new mongoose.Schema({
    stockNo: String,
    stockDate: String,
    stockName: String,
    stockShares: Number, //成交股數
    volume: Number, //成交筆數
    amount: Number, //成交金額
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    diff: Number,
    change: Number,
    peRatio: Number,
    ma5: Number,
    ma20: Number,
    ma60: Number,
    ma120: Number,
    avg: Number,
    stockType: String,
    excludeD: Boolean,
    excludeR: Boolean,
    foreignBuy: Number,
    foreignSell: Number,
    foreignTotal: Number,
    foreignTotalAmount: Number,
    dealerBuy: Number,
    dealerSell: Number,
    dealerTotal: Number,
    dealerTotalAmount: Number,
    fundBuy: Number,
    fundSell: Number,
    fundTotal: Number,
    fundTotalAmount: Number,
  },{collection:'stocks'});