import { Controller } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
  ) {}

  @RabbitRPC({
    exchange: 'neuron.events',
    routingKey: 'bugbounty.report.reload',
    queue: 'bugbounty_report_reload',
  })
  async handleReloadReports(data: any) {
    return await this.reportService.reloadReports(data.user.id);
  }

  @RabbitRPC({
    exchange: 'neuron.events',
    routingKey: 'bugbounty.reports',
    queue: 'bugbounty_reports',
  })
  async getReports(data: any) {
    return await this.reportService.getReports(data.user.id);
  }
} 
