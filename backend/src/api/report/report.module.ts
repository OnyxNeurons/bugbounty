import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PrismaService } from '@/prisma/prisma.service';
import { YesWeHackService } from '@/api/platform/yeswehack.service';
import { HackeroneService } from '@/api/platform/hackerone.service';
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
  controllers: [ReportController],
  providers: [ReportService, PrismaService, YesWeHackService, HackeroneService],
  exports: [ReportService],
})
export class ReportModule {}
