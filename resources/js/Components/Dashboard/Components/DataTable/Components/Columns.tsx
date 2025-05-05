import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/Components/ui/checkbox";
import { DataTableColumnHeader } from "@/Components/Dashboard/Components/DataTable/Components/DataTableColumnHeader";
import { DataTableRowActions } from "@/Components/Dashboard/Components/DataTable/Components/DataTableRowActions";
import { decode } from "html-entities";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { rolePegawai } from "@/Components/Dashboard/Components/Admin/Pegawai/DataTableFilterPegawai";
import { tahunStyles, subroundStyles } from "../../Admin/Pengecekan/DataTableFilterPengecekan";
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
import { ReactNode } from "react";

interface ColumnTitleMap {
  [key: string]: string;
}

export type DataTableColumnDef<TData> = ColumnDef<TData, any>;

// Parameter customRender bersifat opsional dan default akan mengembalikan undefined.
export const generateColumns = <TData,>(
  name: string | undefined,
  columnTitleMap: ColumnTitleMap,
  customRender?: (columnKey: string, row: TData) => ReactNode,
  onDetail?: (id: string, data: any) => void,
  onUpdateStatus?: (id: string, status: string) => void,
  onEdit?: (id: string, data: any) => void,
  onCopy?: (data: any) => void,
  onDelete?: (id: string) => void,
  onRilis?: (id: string, data: any) => void
): DataTableColumnDef<TData>[] => {
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

  const DATE_KEY_REGEX = /(tanggal|tgl|panen|rilis|date)/i;

  // Loop melalui semua key dan buat definisi kolom
  allKeys.forEach((key) => {
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
    } else if (DATE_KEY_REGEX.test(key)) {
    columnDef = {
      accessorKey: key,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={columnTitleMap[key] || key}
          className="flex justify-center"
        />
      ),
      cell: ({ row }) => {
        const raw = row.getValue<string>(key);
        if (!raw) return <span className="text-gray-400">—</span>;
        return (
          <div className="flex justify-center">
            {dayjs.utc(raw).format("DD/MM/YYYY")}
          </div>
        );
      },
      filterFn: (row: any, id: string, value: string) => {
        const rowValue: string = row.getValue(id);
        return value.includes(rowValue);
      },
    };
  }else if (name === 'templatePesan' && key === 'text') {
      columnDef = {
        accessorKey: key,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={columnTitleMap[key] || key}
            className="flex justify-center"
          />
        ),
        cell: ({ row }) => (
          <div
            className="
              truncate
              max-w-xs
              lg:max-w-none
              lg:overflow-visible
              lg:whitespace-normal
            "
          >
            {row.getValue<string>(key)}
          </div>
        ),
        filterFn: (row, id, value: string) =>
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
          let formattedData = dayjs.utc(timeDate).format("DD/MM/YYYY HH:mm");
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
    } else if (key === "tahun_listing") {
      columnDef = {
        accessorKey: key,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={columnTitleMap[key] || key}
            className="flex justify-center"
          />
        ),
        cell: ({ row }) => {
          const year = row.getValue<string>(key)
          const yearClass = tahunStyles.DEFAULT || "bg-gray-100 text-gray-800";
          // give all years the same badge color:
          return (
            <div className="flex justify-center">
              <Badge className={`text-xs ${yearClass}`}>
                {year}
              </Badge>
            </div>
          );
        },
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id))
        },
      }
    } else if (key === "subround") {
      columnDef = {
        accessorKey: key,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={columnTitleMap[key] || key}
            className="flex justify-center"
          />
        ),
        cell: ({ row }) => {
          // raw value from the row (could be "1", "01", "02", etc)
          const raw = row.getValue<string>(key)
          // normalize: remove any leading zeros so "01" → "1"
          const norm = String(Number(raw))
          const badgeClass = subroundStyles[norm] || "bg-gray-100 text-gray-800"
          return (
            <div className="flex justify-center">
              <Badge className={`text-xs ${badgeClass}`}>
                {raw}
              </Badge>
            </div>
          )
        },
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id))
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
    } else if (key === "is_verif" && name === "Hasil Ubinan Admin") {
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
            {row.getValue(key)
              ? "Sudah diverifikasi"
              : "Belum diverifikasi"}
          </div>
        ),
      };
    }
     else {
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
        cell: ({ row }: { row: any }) => {
          // Jika customRender ada, panggil untuk key ini
          if (customRender) {
            const customContent = customRender(key, row.original);
            if (customContent !== null && customContent !== undefined) {
              return customContent;
            }
          }
          return (
            <div className="flex space-x-2">
              <span className="max-w-[500px] truncate font-medium">
                {row.getValue(key)}
              </span>
            </div>
          );
        },
        filterFn: (row: any, id: string, value: string) =>
          value.includes(row.getValue(id)),
      };
    }

    // Tambahkan kolom yang baru dibuat ke baseColumns
    baseColumns.push(columnDef);
  });

  return baseColumns;
};
