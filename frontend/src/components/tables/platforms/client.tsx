"use client";
import { BasicDataTable } from "@/components/ui/basic-data-table";
import { Platform } from "@/types";
import { Plus } from "lucide-react";
import { columns } from "./columns";

interface PlatformsProps {
  OnyxSDK: any;
  data: Platform[];
}

export const PlatformClient: React.FC<PlatformsProps> = ({ OnyxSDK, data }) => {
  const { Button } = OnyxSDK.ui;

  return (
    <>
      <div className="flex items-start justify-between pb-4">
        <Button
          className="text-xs md:text-sm"
          onClick={() => window.location.href = `/dashboard/neuron/bugbounty/platform/new`}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <BasicDataTable OnyxSDK={OnyxSDK} searchKey="name" columns={columns(OnyxSDK)} data={data} />
    </>
  );
};