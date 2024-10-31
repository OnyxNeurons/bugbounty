import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { YesWeHackService } from '@/api/platform/yeswehack.service';
import { HackeroneService } from '@/api/platform/hackerone.service';

@Injectable()
export class ProgramService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly yesWeHackService: YesWeHackService,
    private readonly hackeroneService: HackeroneService,
  ) {}

  async reloadPrograms(userId: string) {
    try {
      const platforms = await this.prisma.platform.findMany({
        where: {
          userId: userId,
        },
      });

      for (const platform of platforms) {
        switch (platform.slug) {
          case "yeswehack":
            await this.yesWeHackService.reloadPrograms(userId, platform.id);
            break;
          case "hackerone":
            await this.hackeroneService.reloadPrograms(userId, platform.id);
            break;
        }
      }

      return { success: true, message: "Programs reloaded successfully" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getProgram(userId: string, id: string) {
    return await this.prisma.program.findUnique({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        scope: true,
      },
    });
  }

  async getPrograms(userId: string) {
    return await this.prisma.program.findMany({
      where: {
        userId: userId,
      },
    });
  }

}
