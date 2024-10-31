import { PlatformForm } from "@/components/forms/platform-form";
import { useEffect, useState } from "react";

export function EditPlatformPage({ OnyxSDK }: { OnyxSDK: any }) {
  const { DashboardShell } = OnyxSDK.ui;
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const [platform, setPlatform] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatform = async () => {
      const platform = await OnyxSDK.api.get(
        `/neuron/bugbounty/platform/get?id=${id}`
      );
      setPlatform(platform);
      setLoading(false);
    };

    fetchPlatform();
  }, [id]);

  return (
    <DashboardShell heading="Edit Platform" text="Edit a platform">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <PlatformForm OnyxSDK={OnyxSDK} initialData={platform} />
      )}
    </DashboardShell>
  );
}
