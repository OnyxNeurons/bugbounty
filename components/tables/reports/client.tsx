"use client";
import { Button, DataTable, toast } from "@onyx/ui";
import { Report } from "@onyx/neurons/bugbounty/prisma/generated/client";
import { columns } from "./columns";

interface ReportsProps {
  data: Report[];
}

export const ReportClient: React.FC<ReportsProps> = ({ data }) => {

  const handleReload = () => {
    fetch("/api/neuron/bugbounty/report/reload").then((res) => {
      if (res.ok) {
        toast({
          variant: "default",
          title: "Reports reloaded",
        });
      } else {
        toast({
          variant: "default",
          title: "Error reloading reports",
        });
      }
    })
  };

  return (
    <>
      <div className="flex items-start justify-between pb-4">
        <Button
          className="text-xs md:text-sm"
          onClick={() => handleReload()}
        >
          Reload
        </Button>
      </div>
      <DataTable searchKey="title" columns={columns} data={data} filterBy="platformId" />
    </>
  );
};