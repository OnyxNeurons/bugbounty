import { Program } from "@/types";
import { ProgramClient } from "@/components/tables/programs/client";
import { useEffect, useState } from "react";

export function ProgramsPage({ OnyxSDK }: { OnyxSDK: any }) {
  const { DashboardShell } = OnyxSDK.ui;

  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    OnyxSDK.api.get("/neuron/bugbounty/programs").then(setPrograms);
  }, []);

  return (
    <DashboardShell heading="Programs" text="Manage your programs">
      <ProgramClient OnyxSDK={OnyxSDK} data={programs} />
    </DashboardShell>
  );
}
