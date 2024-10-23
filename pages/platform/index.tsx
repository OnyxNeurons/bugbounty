import { constructMetadata } from "@onyx/core/utils/metadata";
import { Card, CardHeader, CardTitle, CardContent, DashboardShell, DashboardHeader } from "@onyx/ui"
import { prisma } from "@onyx/db";
import { Platform } from "@onyx/neurons/bugbounty/prisma/generated/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@onyx/core/auth";
import { redirect } from "next/navigation";
import { PlatformClient } from "@onyx/neurons/bugbounty/components/tables/platforms/client";

export const metadata = constructMetadata({
  title: "Platforms"
});

export default async function PlatformsPage() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");
  
    const platforms: Platform[] = await prisma['bugbounty'].platform.findMany({
      where: {
        userId: session.user.id,
      },
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

  return (
    <DashboardShell>
      <DashboardHeader heading="Platforms" text="Manage your platforms"></DashboardHeader>
      <Card className="pt-4">
        <CardContent>
            <PlatformClient data={platforms} />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
