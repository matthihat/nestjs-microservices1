import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalExceptionsHandler } from './GlobalExceptionsHandler';
import { WinstonLoggerModule } from './winston-logger.module';

@Module({
  imports: [WinstonLoggerModule],
  controllers: [AppController],
  providers: [AppService, GlobalExceptionsHandler],
})
export class AppModule {}
