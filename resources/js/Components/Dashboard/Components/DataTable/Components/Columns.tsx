import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/Components/ui/checkbox";
import { DataTableColumnHeader } from "@/Components/Dashboard/Components/DataTable/Components/DataTableColumnHeader";
import { DataTableRowActions } from "@/Components/Dashboard/Components/DataTable/Components/DataTableRowActions";
import { decode } from 'html-entities';
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { rolePegawai } from "@/Components/Dashboard/Components/Admin/Pegawai/DataTableFilterPegawai";
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/id';
dayjs.extend(utc);
dayjs.locale('id');

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/Components/ui/tooltip";
import { useState } from "react";

interface ColumnTitleMap {
  [key: string]: string;
}

type DataTableColumnDef<TData> = ColumnDef<TData, any>;
// Function to generate columns from schema
export const generateColumns = <TData,>(
    name: string,
    columnTitleMap: ColumnTitleMap,
    onDetail?: (id: string, data: any) => void,
    onUpdateStatus?: (id: string, status: string) => void,
    onEdit?: (id: string, data: any) => void,
    onCopy?: (data: any) => void,
    onDelete?: (id: string) => void,
    onRilis?: (id: string, data: any) => void,
): DataTableColumnDef<TData>[] => {
  return [
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
                    name={name}
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
    ...Object.keys(columnTitleMap).filter(key => key !== 'id' && key !== 'user_id').map((key) => {
      if (key === 'abstract') {
        return {
          accessorKey: key,
          header: ({ column }: { column: any }) => (
            <DataTableColumnHeader column={column} title={columnTitleMap[key] || key} className="flex justify-center"  />
          ),
          cell: ({ row }: { row: any }) => {
            const abstract = row.getValue(key) as string;
            const cleanedAbstract = abstract ? decode(abstract.replace(//g, '')) : '';
            return (
              <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium line-clamp-3" dangerouslySetInnerHTML={{ __html: cleanedAbstract }}>
                </span>
              </div>
            );
          },
          filterFn: (row: any, id: string, value: string) => {
            return value.includes(row.getValue(id))
          },
        };
      }

      if (key === 'date') {
        return {
          accessorKey: key,
          header: ({ column }: { column: any }) => (
            <DataTableColumnHeader column={column} title={columnTitleMap[key] || key} className="flex justify-center"  />
          ),
          cell: ({ row }: { row: any }) => {
            const timeDate = row.getValue(key);
            let formattedData = dayjs.utc(timeDate).format('DD MMMM YYYY HH:mm');
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
      }

      // Kolom role di Tabel User
      if (key === 'role') {
        return {
          accessorKey: key,
          header: ({ column }: { column: any }) => (
            <DataTableColumnHeader column={column} title={columnTitleMap[key] || key} className="flex justify-center"  />
          ),
          cell: ({ row }: { row: any }) => {
            const statusValue: string = row.getValue(key);
            const status = rolePegawai.find(s => s.value === statusValue);
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
      }
      // Kolom role di Tabel User

        // Checkbox
        if (key === 'is_pml') {
            return {
            accessorKey: key,
                header: ({ column }: { column: any }) => (
                    <DataTableColumnHeader column={column} title={columnTitleMap[key] || key} className="flex justify-center" />
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
        }

      return {
        accessorKey: key,
        header: ({ column }: { column: any }) => (
          <DataTableColumnHeader column={column} title={columnTitleMap[key] || key} className="flex justify-center" />
        ),
        cell: ({ row }: { row: any }) => (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue(key)}
            </span>
          </div>
        ),
        filterFn: (row: any, id: string, value: string) => {
          return value.includes(row.getValue(id))
        },
      };
    }),
  ]
};
