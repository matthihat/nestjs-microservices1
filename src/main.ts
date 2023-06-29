import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GlobalExceptionsHandler } from './GlobalExceptionsHandler';
import { WinstonLogger } from './winston.logger';

async function bootstrap() {
  // Application options
  const options = { logger: new WinstonLogger() };

  // Create Nest app
  const app = await NestFactory.create(AppModule, options);

  // Set up global xception handler
  const globalExceptionsHandler = new GlobalExceptionsHandler();
  app.useGlobalFilters(globalExceptionsHandler);

  // Configure and start microservice
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'microservice_queue',
      queueOptions: { durable: false },
    },
  };
  app.connectMicroservice(microserviceOptions);
  await app.startAllMicroservices();

  // Start
  await app.listen(3000);
}

bootstrap();
