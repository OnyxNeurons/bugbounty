"use client";
import { DataTable } from "@/components/ui/data-table";
import { Program } from "@/types";
import { columns } from "./columns";

interface ProgramsProps {
  OnyxSDK: any;
  data: Program[];
}

export const ProgramClient: React.FC<ProgramsProps> = ({ OnyxSDK, data }) => {
  const { Button, toast } = OnyxSDK.ui;

  const handleReload = () => {
    OnyxSDK.api.get("/neuron/bugbounty/program/reload").then((res) => {
      if (res.ok) {
        toast({
          variant: "default",
          title: "Programs reloaded",
        });
      } else {
        toast({
          variant: "default",
          title: "Error reloading programs",
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
      <DataTable OnyxSDK={OnyxSDK} searchKey="name" columns={columns(OnyxSDK)} data={data} filterBy="type" />
    </>
  );
};