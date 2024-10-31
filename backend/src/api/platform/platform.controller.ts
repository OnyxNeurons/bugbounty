import { Controller } from '@nestjs/common';
import { RabbitRPC, AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { PlatformService } from './platform.service';

@Controller('platform')
export class PlatformController {
  constructor(
    private readonly platformService: PlatformService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @RabbitRPC({
    exchange: 'neuron.events',
    routingKey: 'bugbounty.platform.try',
    queue: 'bugbounty_platform_try',
  })
  async handleTryPlatform(data: any) {
    return await this.platformService.tryPlatform(data.body);
  }

  @RabbitRPC({
    exchange: 'neuron.events', 
    routingKey: 'bugbounty.platform.create',
    queue: 'bugbounty_platform_create',
  })
  async handleCreatePlatform(data: any) {
    return await this.platformService.createPlatform(data.user.id, data.body);
  }

  @RabbitRPC({
    exchange: 'neuron.events',
    routingKey: 'bugbounty.platform.update',
    queue: 'bugbounty_platform_update', 
  })
  async handleUpdatePlatform(data: any) {
    return await this.platformService.updatePlatform(data.user.id, data.query.id, data.body);
  }

  @RabbitRPC({
    exchange: 'neuron.events',
    routingKey: 'bugbounty.platform.delete',
    queue: 'bugbounty_platform_delete',
  })
  async handleDeletePlatform(data: any) {
    return await this.platformService.deletePlatform(data.user.id, data.query.id);
  }

  @RabbitRPC({
    exchange: 'neuron.events',
    routingKey: 'bugbounty.platform.get',
    queue: 'bugbounty_platform_get',
  })
  async handleGetPlatform(data: any) {
    return await this.platformService.getPlatform(data.user.id, data.query.id);
  }

  @RabbitRPC({
    exchange: 'neuron.events',
    routingKey: 'bugbounty.platforms',
    queue: 'bugbounty_platforms',
  })
  async handleGetPlatforms(data: any) {
    return await this.platformService.getPlatforms(data.user.id);
  }

}
