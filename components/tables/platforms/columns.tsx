"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Platform } from "@onyx/neurons/bugbounty/prisma/generated/client";

export const columns: ColumnDef<Platform>[] = [
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
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];