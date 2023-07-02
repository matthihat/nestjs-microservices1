import { Module } from '@nestjs/common';
import { WinstonLogger } from '@matthihat/customlogger';

@Module({
  providers: [
    {
      provide: WinstonLogger,
      useValue: new WinstonLogger(),
    },
  ],
  exports: [WinstonLogger],
})
export class WinstonLoggerModule {}
