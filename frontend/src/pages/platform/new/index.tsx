import { PlatformForm } from "@/components/forms/platform-form";


export function NewPlatformPage({ OnyxSDK }: { OnyxSDK: any }) {
  const { DashboardShell, Card, CardContent } = OnyxSDK.ui;

  return (
    <DashboardShell heading="New Platform" text="Add a new platform">
      <Card className="pt-4">
        <CardContent>
            <PlatformForm OnyxSDK={OnyxSDK} initialData={null} />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
