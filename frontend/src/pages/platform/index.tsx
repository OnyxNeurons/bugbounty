import { Platform } from "@/types";
import { PlatformClient } from "@/components/tables/platforms/client";
import { useState, useEffect } from "react";

export function PlatformsPage({ OnyxSDK }: { OnyxSDK: any }) {
  const { DashboardShell } = OnyxSDK.ui;
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  useEffect(() => {
    OnyxSDK.api.get("/neuron/bugbounty/platforms").then(setPlatforms);
  }, []);

  return (
    <DashboardShell heading="Platforms" text="Manage your platforms">
      <PlatformClient data={platforms} OnyxSDK={OnyxSDK} />
    </DashboardShell>
  );
}
