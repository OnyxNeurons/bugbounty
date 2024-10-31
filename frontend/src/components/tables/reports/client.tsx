import { Report } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

interface ReportsProps {
  OnyxSDK: any;
  data: Report[];
}

export const ReportClient: React.FC<ReportsProps> = ({ OnyxSDK, data }) => {

  const { Button, toast } = OnyxSDK.ui;

  const handleReload = () => {
    OnyxSDK.api.get("/neuron/bugbounty/report/reload").then((res) => {
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
      <DataTable OnyxSDK={OnyxSDK} searchKey="title" columns={columns(OnyxSDK)} data={data} filterBy="platformId" />
    </>
  );
};