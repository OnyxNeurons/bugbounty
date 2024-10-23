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
import { Report } from "@onyx/neurons/bugbounty/prisma/generated/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@onyx/core/auth";
import { redirect } from "next/navigation";
import { ReportClient } from "@onyx/neurons/bugbounty/components/tables/reports/client";

export const metadata = constructMetadata({
  title: "Reports",
});

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const reports: Report[] = await prisma["bugbounty"].report.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      platform: true, 
      program: true,      
    },
    orderBy: [
      {
        updatedDate: "desc",
      },
    ],
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Reports"
        text="Manage your reports"
      ></DashboardHeader>
      <Card className="pt-4">
        <CardContent>
          <ReportClient data={reports} />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
