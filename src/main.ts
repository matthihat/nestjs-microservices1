import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GlobalExceptionsHandler } from './GlobalExceptionsHandler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  await app.listen(3000);
}

bootstrap();
