import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { WinstonLogger } from '@matthihat/customlogger';
import { SERVICENAME } from './constants';
import { BaseException } from '@matthihat/custommodels/dist/exceptions/baseException';
import { Origin } from '@matthihat/custommodels/dist/enums/origin';
import { EventMessage } from '@matthihat/custommodels/dist/events/eventmessage';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: WinstonLogger,
  ) {
    this.logger.debug('Instantiating ' + SERVICENAME);
  }

  @EventPattern('message_pattern')
  async handleEvent(@Payload() data: EventMessage) {
    console.log(data); // This will log the message sent from the other microservice
  }

  @MessagePattern('message_pattern')
  async handleMessage(@Payload() data: string) {
    console.log(data); // This will log the message sent from the other microservice
    return 'Hello back from MS1';
  }

  @Get()
  getHello(): string {
    throw new BaseException(
      'Felmeddelande',
      HttpStatus.GATEWAY_TIMEOUT,
      Origin.TEAM,
    );
    return this.appService.getHello();
  }
}
