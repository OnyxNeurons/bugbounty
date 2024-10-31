"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { ArrowUpDown } from "lucide-react";
import { Program } from "@/types";

export const columns = (OnyxSDK: any): ColumnDef<Program>[] => [
  {
    accessorKey: "name",
    header:  ({ column }) => {
      return (
        <OnyxSDK.ui.Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </OnyxSDK.ui.Button>
      )
    },
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "type",
    header: "TYPE",
  },
  {
    accessorKey: "platform.name",
    header: "PLATFORM",
  },
  {
    accessorKey: "bountyMax",
    header: "BOUNTY MAX",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction OnyxSDK={OnyxSDK} data={row.original} />,
  },
];