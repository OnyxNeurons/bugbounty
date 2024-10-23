import { constructMetadata } from "@onyx/core/utils/metadata";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DashboardShell,
  DashboardHeader,
} from "@onyx/ui";
import { prisma } from "@onyx/db";
import { Program } from "@onyx/neurons/bugbounty/prisma/generated/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@onyx/core/auth";
import { redirect } from "next/navigation";
import { ProgramClient } from "@onyx/neurons/bugbounty/components/tables/programs/client";

export const metadata = constructMetadata({
  title: "Programs",
});

export default async function ProgramsPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const programs: Program[] = await prisma["bugbounty"].program.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      platform: true,
    },
    orderBy: [
      {
        name: "asc",
      },
    ],
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Programs"
        text="Manage your programs"
      ></DashboardHeader>
      <Card className="pt-4">
        <CardContent>
          <ProgramClient data={programs} />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
