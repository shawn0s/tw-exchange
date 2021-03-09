import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FetchService } from './fetch.service';

@Module({
  imports:[HttpModule.register({
    // timeout: 5000,
    maxRedirects: 5,
  }),ConfigModule],
  providers: [FetchService],
  exports: [FetchService]
})
export class FetchModule {}
