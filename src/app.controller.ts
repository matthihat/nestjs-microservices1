import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { WinstonLogger } from './winston.logger';
import { SERVICENAME } from './constants';

@Controller()
export class AppController {
  private readonly logger = new WinstonLogger();

  constructor(private readonly appService: AppService) {
    this.logger.debug('Instantiating ' + SERVICENAME);
  }

  @EventPattern('message_pattern')
  async handleEvent(@Payload() data: string) {
    console.log(data); // This will log the message sent from the other microservice
  }

  @MessagePattern('message_pattern')
  async handleMessage(@Payload() data: string) {
    console.log(data); // This will log the message sent from the other microservice
    return 'Hello back from MS1';
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
