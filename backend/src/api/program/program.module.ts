import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { HackeroneService } from '@/api/platform/hackerone.service';
import { YesWeHackService } from '@/api/platform/yeswehack.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ProgramController } from './program.controller';
import { ProgramService } from './program.service';

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
  controllers: [ProgramController], 
  providers: [PrismaService, ProgramService, HackeroneService, YesWeHackService],
  exports: [HackeroneService, YesWeHackService],
})
export class ProgramModule {}
