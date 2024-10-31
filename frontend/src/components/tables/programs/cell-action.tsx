"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Program } from "@/types";
import { MoreHorizontal} from "lucide-react";

interface CellActionProps {
  OnyxSDK: any;
  data: Program;
}

export const CellAction: React.FC<CellActionProps> = ({ OnyxSDK, data }) => {
  const { Button } = OnyxSDK.ui;

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => window.location.href = `/dashboard/neuron/bugbounty/program/view?id=${data.id}`}
          >
            See more
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {}}
          >
            Add to favorites
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};