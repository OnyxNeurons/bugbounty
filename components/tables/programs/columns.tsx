"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@onyx/ui";
import { Program } from "@onyx/neurons/bugbounty/prisma/generated/client";

export const columns: ColumnDef<Program>[] = [
  {
    accessorKey: "name",
    header:  ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
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
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];