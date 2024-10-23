'use client';
import { constructMetadata } from "@onyx/core/utils/metadata";
import { Card, CardHeader, CardTitle, CardContent, DashboardShell, DashboardHeader } from "@onyx/ui"
import { PlatformForm } from "@onyx/neurons/bugbounty/components/forms/platform-form";

export const metadata = constructMetadata({
  title: "New Platform"
});

export default function NewPlatformPage() {

  return (
    <DashboardShell>
      <DashboardHeader heading="New Platform" text="Add a new platform"></DashboardHeader>
      <Card className="pt-4">
        <CardContent>
            <PlatformForm initialData={null} />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
