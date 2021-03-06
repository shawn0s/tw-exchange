import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FetchModule } from './fetch/fetch.module';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost/nest',{
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    FetchModule, StockModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
