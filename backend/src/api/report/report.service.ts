import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { YesWeHackService } from '@/api/platform/yeswehack.service';
import { HackeroneService } from '@/api/platform/hackerone.service';

@Injectable()
export class ReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly yesWeHackService: YesWeHackService,
    private readonly hackeroneService: HackeroneService,
  ) {}

  async reloadReports(userId: string) {
    try {
      const platforms = await this.prisma.platform.findMany({
        where: {
          userId: userId,
        },
      });

      for (const platform of platforms) {
        switch (platform.slug) {
          case 'yeswehack':
            await this.yesWeHackService.reloadReports(userId, platform.id);
            break;
          case 'hackerone':
            await this.hackeroneService.reloadReports(userId, platform.id);
            break;
        }
      }

      return { success: true, message: 'Reports reloaded successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getReports(userId: string) {
    return await this.prisma.report.findMany({
      where: {
        userId: userId,
      },
      include: {
        platform: true,
        program: true,
      },
      orderBy: [
        {
          createdDate: 'desc',
        },
      ],
    });
  }
}
