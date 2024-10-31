"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Platform } from "@/types";

export const columns = (OnyxSDK: any): ColumnDef<Platform>[] => [
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "hunterUsername",
    header: "USERNAME",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction OnyxSDK={OnyxSDK} data={row.original} />,
  },
];