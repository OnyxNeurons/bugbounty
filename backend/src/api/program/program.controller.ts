import { Controller } from '@nestjs/common';
import { RabbitRPC, AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ProgramService } from './program.service';

@Controller('program')
export class ProgramController {
  constructor(
    private readonly programService: ProgramService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @RabbitRPC({
    exchange: 'neuron.events',
    routingKey: 'bugbounty.program.reload',
    queue: 'bugbounty_program_reload',
  })
  async handleReloadPrograms(data: any) {
    return await this.programService.reloadPrograms(data.user.id);
  }

  @RabbitRPC({
    exchange: 'neuron.events',
    routingKey: 'bugbounty.program.get',
    queue: 'bugbounty_program_get',
  })
  async getProgram(data: any) {
    return await this.programService.getProgram(data.user.id, data.query.id);
  }

  @RabbitRPC({
    exchange: 'neuron.events',
    routingKey: 'bugbounty.programs',
    queue: 'bugbounty_programs',
  })
  async getPrograms(data: any) {
    return await this.programService.getPrograms(data.user.id);
  }
}
