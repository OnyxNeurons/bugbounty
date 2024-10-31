import { useState, useEffect } from "react";
import { Report } from "@/types";
import { ReportClient } from "@/components/tables/reports/client";

export const ReportsPage = ({ OnyxSDK }: { OnyxSDK: any }) => {
  const { DashboardShell } = OnyxSDK.ui;

  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    OnyxSDK.api.get("/neuron/bugbounty/reports").then(setReports);
  }, []);

  return (
    <DashboardShell heading="Reports" text="Manage your reports">
      <ReportClient OnyxSDK={OnyxSDK} data={reports} />
    </DashboardShell>
  );
};
