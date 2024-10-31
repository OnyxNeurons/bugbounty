import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventsModule } from './events/events.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { PlatformModule } from './api/platform/platform.module';
import { ProgramModule } from './api/program/program.module';
import { ReportModule } from './api/report/report.module';

@Module({
  imports: [
    EventsModule,
    PlatformModule,
    ProgramModule,
    ReportModule,
    ServeStaticModule.forRoot({
      rootPath: '/frontend', 
      serveRoot: '/frontend', 
    }),
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
})
export class AppModule {}
