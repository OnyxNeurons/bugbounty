
const getBountyWithCurrency = (bounty: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(bounty);
}

export function RecentBounty({ reports } : { reports: any }) {
  return (
    <div className="space-y-8">
      {reports.map((report: any) => (
        <div key={report.id} className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{report.platform.name}</p>
            <p className="text-sm text-muted-foreground overflow-hidden truncate w-80">{report.program.name}</p>
          </div>
          <div className="ml-auto font-medium">{getBountyWithCurrency(report.bounty, report.currency)}</div>
        </div>
      ))}
    </div>
  );
}
