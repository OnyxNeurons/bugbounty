import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.RABBITMQ_URL || 'amqp://onyx-queue:5672',
      exchanges: [
        {
          name: 'neuron.events',
          type: 'topic',
        },
      ],
      defaultRpcTimeout: 15000,
      enableControllerDiscovery: true,
      connectionInitOptions: {
        wait: false,
        reject: false,
        timeout: 3000,
      },
    }),
  ],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
