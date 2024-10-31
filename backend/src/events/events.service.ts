import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  RabbitSubscribe,
  RabbitRPC,
  AmqpConnection,
} from '@golevelup/nestjs-rabbitmq';
import { readFileSync } from 'fs';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  @RabbitSubscribe({
    exchange: 'neuron.events',
    routingKey: 'neuron.ask_for_discovery',
    queue: 'bugbounty_discovery_requests',
  })
  async handleDiscovery(data: any) {
    console.log('Discovery event received in bugbounty neuron:', data);
    await this.sendDiscoveryEvent();
  }

  async onModuleInit() {
    // Wait for connection to be established
    this.amqpConnection.managedConnection.on('connect', async () => {
      await this.sendDiscoveryEvent();
    });
  }

  async sendDiscoveryEvent() {
    try {
      const manifest = JSON.parse(readFileSync('/manifest.json', 'utf-8'));
      await this.amqpConnection.publish('neuron.events', 'neuron.discovery', {
        manifest,
        timestamp: new Date(),
      });
      console.log('Discovery event emitted successfully');
    } catch (error) {
      console.error('Failed to emit discovery event:', error);
    }
  }
}
