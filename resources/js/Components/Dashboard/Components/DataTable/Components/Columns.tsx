import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/Components/ui/checkbox";
import { DataTableColumnHeader } from "@/Components/Dashboard/Components/DataTable/Components/DataTableColumnHeader";
import { DataTableRowActions } from "@/Components/Dashboard/Components/DataTable/Components/DataTableRowActions";
import { decode } from "html-entities";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { rolePegawai } from "@/Components/Dashboard/Components/Admin/Pegawai/DataTableFilterPegawai";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/id";
dayjs.extend(utc);
dayjs.locale("id");

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/Components/ui/tooltip";
import { useState } from "react";

interface ColumnTitleMap {
  [key: string]: string;
}

export type DataTableColumnDef<TData> = ColumnDef<TData, any>;

export const generateColumns = <TData,>(
  name: string | undefined,
  columnTitleMap: ColumnTitleMap,
  onDetail?: (id: string, data: any) => void,
  onUpdateStatus?: (id: string, status: string) => void,
  onEdit?: (id: string, data: any) => void,
  onCopy?: (data: any) => void,
  onDelete?: (id: string) => void,
  onRilis?: (id: string, data: any) => void
): DataTableColumnDef<TData>[] => {
  // Kolom khusus untuk relasi (extra columns)
  const extraColumns: DataTableColumnDef<TData>[] = [
    {
      header: "Nomor BS",
      cell: ({ row }: { row: any }) => {
        const nomorBs = row.original?.nama_sls?.blok_sensus?.nomor_bs;
        return nomorBs ? String(nomorBs) : "";
      },
    },
    {
      header: "Nama SLS",
      cell: ({ row }: { row: any }) => {
        const namaSls = row.original?.nama_sls?.nama_sls;
        return namaSls ? String(namaSls) : "";
      },
    },
  ];

  // Mulai dengan kolom-kolom statis: aksi dan checkbox
  const baseColumns: DataTableColumnDef<TData>[] = [
    {
      id: "actions",
      header: ({ column }: { column: any }) => (
        <div className="flex space-x-2 items-center justify-center">
          <DataTableColumnHeader column={column} title="Aksi" />
        </div>
      ),
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2 items-center justify-center">
          <DataTableRowActions
            name={name ?? ""}
            row={row}
            onDetail={onDetail}
            onUpdateStatus={onUpdateStatus}
            onEdit={onEdit}
            onCopy={onCopy}
            onDelete={onDelete}
            onRilis={onRilis}
          />
        </div>
      ),
    },
    {
      id: "select",
      header: ({ table }: { table: any }) => (
        <div className="flex space-x-2 items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        </div>
      ),
      cell: ({ row }: { row: any }) => (
        <div className="flex space-x-2 items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  // Ambil semua key dari columnTitleMap
  const allKeys = Object.keys(columnTitleMap).filter(
    (key) => key !== "id" && key !== "user_id"
  );

  // Loop melalui semua key dan buat definisi kolom
  allKeys.forEach((key) => {
    // Untuk key "nama_sls" dan "nomor_bs", kita lewati (karena akan ditangani lewat extraColumns)
    if (key === "nama_sls" || key === "nomor_bs") {
      return;
    }

    // Buat kolom khusus untuk key
    let columnDef: DataTableColumnDef<TData>;

    if (key === "abstract") {
      columnDef = {
        accessorKey: key,
        header: ({ column }: { column: any }) => (
          <DataTableColumnHeader
            column={column}
            title={columnTitleMap[key] || key}
            className="flex justify-center"
          />
        ),
        cell: ({ row }: { row: any }) => {
          const abstract = row.getValue(key) as string;
          const cleanedAbstract = abstract
            ? decode(abstract.replace(//g, ""))
            : "";
          return (
            <div className="flex space-x-2">
              <span
                className="max-w-[500px] truncate font-medium line-clamp-3"
                dangerouslySetInnerHTML={{ __html: cleanedAbstract }}
              ></span>
            </div>
          );
        },
        filterFn: (row: any, id: string, value: string) =>
          value.includes(row.getValue(id)),
      };
    } else if (key === "date") {
      columnDef = {
        accessorKey: key,
        header: ({ column }: { column: any }) => (
          <DataTableColumnHeader
            column={column}
            title={columnTitleMap[key] || key}
            className="flex justify-center"
          />
        ),
        cell: ({ row }: { row: any }) => {
          const timeDate = row.getValue(key);
          let formattedData = dayjs.utc(timeDate).format("DD MMMM YYYY HH:mm");
          return (
            <div className="flex space-x-2">
              <span className="max-w-[500px] truncate font-medium">
                {formattedData}
              </span>
            </div>
          );
        },
        filterFn: (row: any, id: string, value: string) => {
          const rowValue: string = row.getValue(id);
          return value.includes(rowValue);
        },
      };
    } else if (key === "role") {
      columnDef = {
        accessorKey: key,
        header: ({ column }: { column: any }) => (
          <DataTableColumnHeader
            column={column}
            title={columnTitleMap[key] || key}
            className="flex justify-center"
          />
        ),
        cell: ({ row }: { row: any }) => {
          const statusValue: string = row.getValue(key);
          const status = rolePegawai.find((s) => s.value === statusValue);
          const statusClass = status?.color || "bg-gray-200 text-gray-800";
          return (
            <div className="flex space-x-2 items-center justify-center">
              <span className="max-w-[500px] truncate font-medium">
                <Badge className={`text-xs ${statusClass}`}>
                  {status?.label}
                </Badge>
              </span>
            </div>
          );
        },
        filterFn: (row: any, id: string, value: string) => {
          const rowValue: string = row.getValue(id);
          return value.includes(rowValue);
        },
      };
    } else if (key === "is_pml") {
      columnDef = {
        accessorKey: key,
        header: ({ column }: { column: any }) => (
          <DataTableColumnHeader
            column={column}
            title={columnTitleMap[key] || key}
            className="flex justify-center"
          />
        ),
        cell: ({ row }: { row: any }) => (
          <div className="flex justify-center">
            <Checkbox
              checked={!!row.getValue(key)}
              disabled
              className="translate-y-[2px] data-[state=checked]:bg-blue-bps-dark data-[state=checked]:opacity-60"
            />
          </div>
        ),
      };
    } else {
      // Kolom default untuk key lainnya
      columnDef = {
        accessorKey: key,
        header: ({ column }: { column: any }) => (
          <DataTableColumnHeader
            column={column}
            title={columnTitleMap[key] || key}
            className="flex justify-center"
          />
        ),
        cell: ({ row }: { row: any }) => (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue(key)}
            </span>
          </div>
        ),
        filterFn: (row: any, id: string, value: string) =>
          value.includes(row.getValue(id)),
      };
    }

    // Tambahkan kolom yang baru dibuat ke baseColumns
    baseColumns.push(columnDef);

    // Jika key yang sedang diproses adalah "subsegmen" dan name adalah "sampel", sisipkan extraColumns
    if (name === "sampel" && key === "subsegmen") {
      baseColumns.push(...extraColumns);
    }
  });

  return baseColumns;
};
