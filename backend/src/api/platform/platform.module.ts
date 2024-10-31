import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { HackeroneService } from './hackerone.service';
import { YesWeHackService } from './yeswehack.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { PlatformController } from './platform.controller';
import { PlatformService } from './platform.service';

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
  controllers: [PlatformController],    
  providers: [PrismaService, PlatformService,  HackeroneService, YesWeHackService],
  exports: [HackeroneService, YesWeHackService],
})
export class PlatformModule {}
