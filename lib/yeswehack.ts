import { TOTP } from "totp-generator";
import { prisma } from "@onyx/db";

export default class YesWeHack {
  static async getFullJWT(email: string, password: string, totp: string) {
    const login = await fetch("https://api.yeswehack.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const loginResponse = await login.json();

    if (loginResponse.token) {
      return loginResponse.token;
    } else if (loginResponse.totp_token) {
      if (totp) {
        const { otp } = TOTP.generate(totp);
        const totpLogin = await fetch(
          "https://api.yeswehack.com/account/totp",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: loginResponse.totp_token,
              code: otp,
            }),
          },
        );
        const totpLoginResponse = await totpLogin.json();
        if (totpLoginResponse.token) {
          return totpLoginResponse.token;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  static async getJWT(userId: string) {
    const platform = await prisma['bugbounty'].platform.findFirst({
      where: {
        userId: userId,
        slug: "yeswehack",
      },
    });

    if (!platform) {
      return null;
    }

    if (
      platform.jwt &&
      platform.jwt !== "" &&
      Date.now() - new Date(platform.updatedAt).getTime() <= 3500000
    ) {
      return platform.jwt;
    }

    const jwt = await this.getFullJWT(
      platform.email,
      platform.password,
      platform.otp,
    );
    if (jwt) {
      await prisma['bugbounty'].platform.update({
        where: {
          id: platform.id,
        },
        data: {
          jwt: jwt,
        },
      });
    }
    return jwt;
  }

  static async getUsername(userId: string) {
    const jwt = await this.getJWT(userId);
    if (!jwt) {
      return null;
    }

    const userReq = await fetch("https://api.yeswehack.com/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const userResp = await userReq.json();
    return userResp.username;
  }

  static async reloadPrograms(userId: string, platformId: string) {
    const jwt = await this.getJWT(userId);
    if (!jwt) {
      return null;
    }

    let page = 1;
    let hasNext = true;

    while (hasNext) {
      const programsReq = await fetch(
        `https://api.yeswehack.com/programs?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      const programsResp = await programsReq.json();
      if (programsResp.pagination.nb_pages === page) {
        hasNext = false;
      } else {
        programsResp.items.forEach(async (program: any) => {
          const existingProgram = await prisma['bugbounty'].program.findFirst({
            where: {
              userId: userId,
              slug: program.slug,
            },
          });

          if (!existingProgram) {
            await prisma['bugbounty'].program.create({
              data: {
                userId: userId,
                platformId: platformId,
                name: program.title,
                slug: program.slug,
                url: `https://yeswehack.com/programs/${program.slug}`,
                vdp: program.vdp,
                type: program.public ? "public" : "private",
                bountyMin: program.bounty_reward_min,
                bountyMax: program.bounty_reward_max,
              },
            });
          } else {
            await prisma['bugbounty'].program.update({
              where: {
                id: existingProgram.id,
              },
              data: {
                name: program.title,
                url: `https://yeswehack.com/programs/${program.slug}`,
                vdp: program.vdp,
                type: program.public ? "public" : "private",
                bountyMin: program.bounty_reward_min,
                bountyMax: program.bounty_reward_max,
              },
            });
          }
          await this.reloadProgramScope(userId, jwt, program.slug);
        });
        page++;
      }
    }
  }

  static async reloadProgramScope(userId: string, jwt: string, slug: string) {
    const programReq = await fetch(
      `https://api.yeswehack.com/programs/${slug}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );

    const programResp = await programReq.json();

    const program = await prisma['bugbounty'].program.findFirst({
      where: {
        userId: userId,
        slug: slug,
      },
    });

    programResp.scopes.forEach(async (scope: any) => {
      const existingScope = await prisma['bugbounty'].scope.findFirst({
        where: {
          programId: program.id,
          scope: scope.scope,
        },
      });

      if (!existingScope) {
        await prisma['bugbounty'].scope.create({
          data: {
            programId: program.id,
            scope: scope.scope,
            scopeType: scope.scope_type,
          },
        });
      } else {
        await prisma['bugbounty'].scope.update({
          where: {
            id: existingScope.id,
          },
          data: {
            scope: scope.scope,
            scopeType: scope.scope_type,
          },
        });
      }
    });
  }

  static async reloadReports(userId: string, platformId: string) {
    const jwt = await this.getJWT(userId);
    if (!jwt) {
      return null;
    }

    // TODO: handle collab
    const reportsUrls = ["https://api.yeswehack.com/user/reports"];

    reportsUrls.forEach(async (url) => {
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const reportsReq = await fetch(`${url}?page=${page}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const reportsResp = await reportsReq.json();
        if (reportsResp.pagination.nb_pages === page) {
          hasNext = false;
        } else {
          reportsResp.items.forEach(async (report: any) => {
            const existingReport = await prisma['bugbounty'].report.findFirst({
              where: {
                userId: userId,
                reportId: report.local_id,
              },
            });

            if (!existingReport) {
              let program = await prisma['bugbounty'].program.findFirst({
                where: {
                  userId: userId,
                  slug: report.program.slug,
                },
              });

              if (!program) {
                program = await prisma['bugbounty'].program.create({
                  data: {
                    userId: userId,
                    platformId: platformId,
                    name: report.program.title,
                    slug: report.program.slug,
                    url: `https://yeswehack.com/programs/${report.program.slug}`,
                    vdp: !report.program.bounty,
                    type: report.program.public ? "public" : "private",
                    bountyMin: report.program.bounty_reward_min,
                    bountyMax: report.program.bounty_reward_max,
                  },
                });
              }
              await prisma['bugbounty'].report.create({
                data: {
                  userId: userId,
                  platformId: platformId,
                  programId: program.id,
                  title: report.title,
                  reportId: report.local_id,
                  bounty: parseFloat((report.reward / 100).toFixed(2)),
                  currency: report.currency,
                  collab: report.collaborative,
                  status: report.status.workflow_state,
                  cvssVector: report.cvss.vector,
                  cvss: report.cvss.score,
                  createdDate: report.created_at,
                  updatedDate: report.changed_at,
                },
              });
            } else {
              await prisma['bugbounty'].report.update({
                where: {
                  id: existingReport.id,
                },
                data: {
                  title: report.title,
                  bounty: parseFloat((report.reward / 100).toFixed(2)),
                  currency: report.currency,
                  collab: report.collaboration,
                  status: report.status.workflow_state,
                  cvssVector: report.cvss.vector,
                  cvss: report.cvss.score,
                  updatedDate: report.changed_at,
                },
              });
            }
          });
          page++;
        }
      }
    });
  }
}