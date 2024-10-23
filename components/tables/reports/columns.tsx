"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@onyx/ui";
import { CellAction } from "./cell-action";
import { Report } from "@onyx/neurons/bugbounty/prisma/generated/client";

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "program.name",
    header: "Program",
  },
  {
    accessorKey: "bounty",
    header:  ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bounty
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row  }) => {
      const amount = parseFloat(row.getValue("bounty"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: row.original.currency || "USD",
      }).format(amount)
 
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];