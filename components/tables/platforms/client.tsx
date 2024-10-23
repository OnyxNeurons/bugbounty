"use client";
import { Button, Separator, BasicDataTable } from "@onyx/ui";
import { Platform } from "@onyx/neurons/bugbounty/prisma/generated/client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";

interface PlatformsProps {
  data: Platform[];
}

export const PlatformClient: React.FC<PlatformsProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between pb-4">
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/neuron/bugbounty/platform/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <BasicDataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};