import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class HackeroneService {
  constructor(private readonly prisma: PrismaService) {}

  async severityToCVSS(severity: string) {
    switch (severity) {
      case "critical":
        return 9.0;
      case "high":
        return 7.0;
      case "medium":
        return 4.0;
      case "low":
        return 2.0;
      case "na":
        return 0.0;
      default:
        return 0.0;
    }
  }

  async verifyLogin(username: string, apiKey: string) {
    const login = await fetch(
      "https://api.hackerone.com/v1/hackers/me/reports",
      {
        headers: {
          Authorization: `Basic ${btoa(username + ":" + apiKey)}`,
        },
      },
    );

    if (login.status === 200) {
      return true;
    } else {
      return false;
    }
  }

  async reloadPrograms(userId: string, platformId: string) {
    const platform = await this.prisma.platform.findFirst({
      where: {
        id: platformId,
      },
    });

    let page = 1;
    let hasNext = true;

    while (hasNext) {
      const programsReq = await fetch(
        `https://api.hackerone.com/v1/hackers/programs?page[number]=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(
              platform.email + ":" + platform.password,
            )}`,
          },
        },
      );
      const programsResp = await programsReq.json();
      if (!programsResp.links.next) {
        hasNext = false;
      }
      programsResp.data.forEach(async (program: any) => {
        const existingProgram = await this.prisma.program.findFirst({
          where: {
            userId: userId,
            slug: program.attributes.handle,
          },
        });

        if (!existingProgram) {
          await this.prisma.program.create({
            data: {
              userId: userId,
              platformId: platformId,
              name: program.attributes.name,
              slug: program.attributes.handle,
              url: `https://hackerone.com/${program.attributes.handle}`,
              vdp: !program.attributes.offers_bounties,
              type:
                program.attributes.state === "public_mode"
                  ? "public"
                  : "private",
              bountyMin: 0,
              bountyMax: 0,
            },
          });
        } else {
          await this.prisma.program.update({
            where: {
              id: existingProgram.id,
            },
            data: {
              name: program.attributes.name,
              url: `https://hackerone.com/${program.attributes.handle}`,
              vdp: !program.attributes.offers_bounties,
              type:
                program.attributes.state === "public_mode"
                  ? "public"
                  : "private",
              bountyMin: 0,
              bountyMax: 0,
            },
          });
        }
        await this.reloadProgramScope(userId, platform, program.attributes.handle);
      });
      page++;
    }
  }

  async reloadProgramScope(userId: string, platform: any, slug: string) {
    const programReq = await fetch(
      `https://api.hackerone.com/v1/hackers/programs/${slug}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${btoa(
            platform.email + ":" + platform.password,
          )}`,
        },
      },
    );

    const programResp = await programReq.json();

    const program = await this.prisma.program.findFirst({
      where: {
        userId: userId,
        slug: slug,
      },
    });

    programResp.relationships.structured_scopes.data.forEach(async (scope: any) => {
      const existingScope = await this.prisma.scope.findFirst({
        where: {
          programId: program.id,
          scope: scope.attributes.asset_identifier,
        },
      });

      if (!existingScope) {
        await this.prisma.scope.create({
          data: {
            programId: program.id,
            scope: scope.attributes.asset_identifier,
            scopeType: scope.attributes.asset_type,
          },
        });
      } else {
        await this.prisma.scope.update({
          where: {
            id: existingScope.id,
          },
          data: {
            scope: scope.attributes.asset_identifier,
            scopeType: scope.attributes.asset_type,
          },
        });
      }
    });
  }

  async reloadReports(userId: string, platformId: string) {
    const platform = await this.prisma.platform.findFirst({
      where: {
        id: platformId,
      },
    });

    let page = 1;
    let hasNext = true;

    while (hasNext) {
      const reportsReq = await fetch(
        `https://api.hackerone.com/v1/hackers/me/reports?page[number]=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(
              platform.email + ":" + platform.password,
            )}`,
          },
        },
      );
      const reportsResp = await reportsReq.json();
      if (!reportsResp.links.next) {
        hasNext = false;
      }
      reportsResp.data.forEach(async (report: any) => {
        const existingReport = await this.prisma.report.findFirst({
          where: {
            userId: userId,
            reportId: report.id,
          },
        });

        if (report.attributes.bounty_awarded_at !== null) {
          let bounty = 0;
          let bountyReq = await fetch(
            `https://api.hackerone.com/v1/hackers/reports/${report.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Basic ${btoa(
                  platform.email + ":" + platform.password,
                )}`,
              },
            },
          );
          let bountyResp = await bountyReq.json();
          bountyResp.data.relationships.bounties.data.forEach((bountyResp: any) => {
            bounty += parseFloat(bountyResp.attributes.awarded_amount);
            report.bounty = bounty;
          });
          
        }

        if (!existingReport) {
          let program = await this.prisma.program.findFirst({
            where: {
              userId: userId,
              slug: report.relationships.program.data.attributes.handle,
            },
          });

          if (program) {
            await this.prisma.report.create({
              data: {
                userId: userId,
                platformId: platformId,
                programId: program.id,
                title: report.attributes.title,
                reportId: report.id,
                bounty: report.bounty || 0,
                currency: "USD",
                collab: false,
                status: report.attributes.state,
                cvssVector: report.relationships.severity.data.attributes
                  .cvss_vector_string
                  ? report.relationships.severity.data.attributes
                      .cvss_vector_string
                  : null,
                cvss: report.relationships.severity.data.attributes.score
                  ? report.relationships.severity.data.attributes.score
                  : null,
                createdDate: report.attributes.created_at,
                updatedDate: report.attributes.last_public_activity_at,
              },
            });
          }
        } else {
          await this.prisma.report.update({
            where: {
              id: existingReport.id,
            },
            data: {
              title: report.attributes.title,
              reportId: report.id,
              bounty: report.bounty || 0,
              currency: "USD",
              collab: false,
              status: report.attributes.state,
              cvssVector: report.relationships.severity.data.attributes
                .cvss_vector_string
                ? report.relationships.severity.data.attributes
                    .cvss_vector_string
                : null,
              cvss: report.relationships.severity.data.attributes.score
                ? report.relationships.severity.data.attributes.score
                : null,
              createdDate: report.attributes.created_at,
              updatedDate: report.attributes.last_public_activity_at,
            },
          });
        }
      });
      page++;
    }
  }
}