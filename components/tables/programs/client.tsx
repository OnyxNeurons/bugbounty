"use client";
import { Button, DataTable, toast } from "@onyx/ui";
import { Program } from "@onyx/neurons/bugbounty/prisma/generated/client";
import { columns } from "./columns";

interface ProgramsProps {
  data: Program[];
}

export const ProgramClient: React.FC<ProgramsProps> = ({ data }) => {

  const handleReload = () => {
    fetch("/api/neuron/bugbounty/program/reload").then((res) => {
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
      <DataTable searchKey="name" columns={columns} data={data} filterBy="type" />
    </>
  );
};