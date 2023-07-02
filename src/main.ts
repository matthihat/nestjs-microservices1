import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GlobalExceptionsHandler } from './GlobalExceptionsHandler';
import { WinstonLogger } from '@matthihat/customlogger/dist';

async function bootstrap() {
  // Create Nest app
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WinstonLogger);
  app.useLogger(logger);

  // Set up global exception handler
  const globalExceptionsHandler = app.get<GlobalExceptionsHandler>(
    GlobalExceptionsHandler,
  );
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
