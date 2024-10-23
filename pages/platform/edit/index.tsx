import { constructMetadata } from "@onyx/core/utils/metadata";
import { authOptions } from "@onyx/core/auth";
import { prisma } from "@onyx/db";
import { Card, CardHeader, CardTitle, CardContent, DashboardShell, DashboardHeader } from "@onyx/ui"
import { PlatformForm } from "@onyx/neurons/bugbounty/components/forms/platform-form";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export const metadata = constructMetadata({
  title: "Edit Platform"
});

export default async function EditPlatformPage({ id }: { id: string }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const platform = await prisma['bugbounty'].platform.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      email: true,
      type: true,
    },
  });

  if (platform) {
    platform.platform = platform.slug;
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Platform" text="Edit a platform"></DashboardHeader>
      <Card className="pt-4">
        <CardContent>
            <PlatformForm initialData={platform} />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
