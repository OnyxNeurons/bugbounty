import { Program, Report } from "@/types";
import { useState, useEffect } from "react";
import { Overview } from "@/components/overview";
import { RecentBounty } from "@/components/recent-bounty";

export const HomePage = ({ OnyxSDK }: { OnyxSDK: any }) => {
  const { Card, CardContent, CardHeader, CardTitle, DashboardShell } =
    OnyxSDK.ui;

  const [programs, setPrograms] = useState<Program[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    OnyxSDK.api.get("/neuron/bugbounty/programs").then(setPrograms);
    OnyxSDK.api.get("/neuron/bugbounty/reports").then(setReports);
  }, []);

  let totalRevenue = 0;
  let revenueLastMonth = 0;
  reports.forEach((report) => {
    totalRevenue += report.bounty;
    if (
      new Date(report.createdDate).getMonth() === new Date().getMonth() - 1 &&
      new Date(report.createdDate).getFullYear() === new Date().getFullYear()
    ) {
      revenueLastMonth += report.bounty;
    }
  });

  let lastFiveReportsWithBounty = reports
    .filter((report) => report.bounty > 0)
    .slice(0, 5);

  let totalPrograms = programs.length;
  let thisYearReports = reports.filter(
    (report) =>
      new Date(report.createdDate).getFullYear() === new Date().getFullYear()
  );

  return (
    <DashboardShell heading="Bug Bounty" text="Get the latest bug bounty stats">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Last Month Revenue
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueLastMonth}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programs</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPrograms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview reports={thisYearReports} />
          </CardContent>
        </Card>
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Bounty</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentBounty reports={lastFiveReportsWithBounty} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};
