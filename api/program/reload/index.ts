import YesWeHack from "@onyx/neurons/bugbounty/lib/yeswehack";
import Hackerone from "@onyx/neurons/bugbounty/lib/hackerone";
import { getServerSession } from "next-auth";
import { authOptions } from "@onyx/core/auth";
import { redirect } from "next/navigation";
import { prisma } from "@onyx/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");

  try {
    const platforms = await prisma['bugbounty'].platform.findMany({
      where: {
        userId: session.user.id,
      },
    });

    platforms.forEach(async (platform) => {
      switch (platform.slug) {
        case "yeswehack":
          await YesWeHack.reloadPrograms(session.user.id, platform.id);
          break;
        case "hackerone":
          await Hackerone.reloadPrograms(session.user.id, platform.id);
          break;
        default:
          return;
      }
    }
    );

    return Response.json({ message: "programs reloaded" });
    
  } catch (e) {
    throw new Error(e);
  }
}