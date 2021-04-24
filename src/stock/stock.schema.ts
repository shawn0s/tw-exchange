import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Stock } from './domain/stock';

export type StockDocument = Stock & Document;



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