import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { YesWeHackService } from './yeswehack.service';
import { HackeroneService } from './hackerone.service';

@Injectable()
export class PlatformService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly yesWeHackService: YesWeHackService,
    private readonly hackeroneService: HackeroneService,
  ) {}

  private readonly platforms = [
    {"slug": "hackerone", "name": "HackerOne", "type": "public"},
    {"slug": "yeswehack", "name": "Yes We Hack", "type": "public"},
  ];

  async tryPlatform(data: any) {
    const { platform, email, password, otp } = data;

    if (!platform || !email || !password) {
      return { success: false, error: "Invalid inputs" };
    }

    try {
      switch (platform) {
        case "yeswehack":
          const jwt = await this.yesWeHackService.getFullJWT(email, password, otp);
          if (!jwt) {
            return { success: false, error: "Invalid credentials" };
          }
          return { success: true };
        case "hackerone":
          const valid = await this.hackeroneService.verifyLogin(email, password);
          if (!valid) {
            return { success: false, error: "Invalid credentials" };
          }
          return { success: true };
        default:
          return { success: false, error: "Invalid platform" };
      }
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async createPlatform(userId: string, data: any) {
    const slug = data.platform;
    const platform = this.platforms.find((p) => p.slug === slug);

    try {
      await this.prisma.platform.create({
        data: {
          name: platform?.name,
          slug: platform?.slug,
          type: platform?.type,
          email: data.email,
          password: data.password,
          otp: data.otp,
          userId: userId,
        },
      });

      switch (slug) {
        case "yeswehack":
          const username = await this.yesWeHackService.getUsername(userId);
          if (username) {
            await this.prisma.platform.update({
              where: {
                userId: userId,
                slug: "yeswehack",
              },
              data: {
                hunterUsername: username,
              },
            });
          }
          break;
        case "hackerone":
          await this.prisma.platform.update({
            where: {
              userId: userId,
              slug: "hackerone",
            },
            data: {
              hunterUsername: data.email,
            },
          });
          break;
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updatePlatform(userId: string, id: string, data: any) {
    try {
      await this.prisma.platform.update({
        where: {
          id: id,
          userId: userId,
        },
        data: {
          email: data.email,
          password: data.password,
          otp: data.otp,
        },
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deletePlatform(userId: string, id: string) {
    try {
      await this.prisma.platform.delete({
        where: {
          id: id,
          userId: userId,
        },
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getPlatform(userId: string, id: string) {
    return await this.prisma.platform.findUnique({
      where: { id: id, userId: userId },
      select: {
        id: true,
        name: true,
        slug: true,
        hunterUsername: true,
        email: true,
        type: true,
      },
    });
  }

  async getPlatforms(userId: string) {
    return await this.prisma.platform.findMany({
      where: { userId: userId },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        hunterUsername: true,
        type: true,
      },
    });
  }

}
