import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

import { DataTablePagination } from "@/Components/Dashboard/Components/DataTable/Components/DataTablePagination";
import { DataTableToolbar } from "@/Components/Dashboard/Components/DataTable/Components/DataTableToolbar";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Collapsible, CollapsibleContent } from '@/Components/ui/collapsible';

interface DataTableProps {
  data: any[];
  columns: ColumnDef<any>[];
  columnTitleMap: { [key: string]: string };
  name: string;
}

export const DataTableAccordion = ({
  data,
  columns,
  columnTitleMap,
  name,
}: DataTableProps) => {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const [expandedRows, setExpandedRows] = React.useState<{ [key: string]: boolean }>({});

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4 w-full overflow-x-auto p-2">
      <DataTableToolbar table={table} columnTitleMap={columnTitleMap} name={name} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={
                        header.id === 'actions' || header.id === 'select'
                          ? 'w-10 max-w-[64px] text-center'
                          : ''
                      }
                      style={{
                        position: header.id === 'actions' || header.id === 'select' ? 'sticky' : 'static',
                        left: header.id === 'actions' ? 0 : header.id === 'select' ? '47px' : 'auto',
                        zIndex: 2,
                        background: 'white',
                        borderRight: '1px solid #e5e7eb',
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="text-xs md:text-sm">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    <TableCell className="w-10">
                      <Button variant="ghost" size="icon" onClick={() => toggleRowExpansion(row.id)}>
                        {expandedRows[row.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === 'actions' || cell.column.id === 'select'
                            ? 'w-10 max-w-[64px] text-center'
                            : ''
                        }
                        style={{
                          position: cell.column.id === 'actions' || cell.column.id === 'select' ? 'sticky' : 'static',
                          left: cell.column.id === 'actions' ? 0 : cell.column.id === 'select' ? '47px' : 'auto',
                          zIndex: 1,
                          background: 'white',
                          borderRight: '1px solid #e5e7eb',
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {expandedRows[row.id] && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="p-4 bg-gray-100">
                        <Collapsible open={expandedRows[row.id]}>
                          <CollapsibleContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nama PPL</TableHead>
                                  <TableHead>Telepon</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Array.isArray(row.original.ppl) && row.original.ppl.length > 0 ? (
                                  row.original.ppl.map((ppl: any) => (
                                    <TableRow key={ppl.id}>
                                      <TableCell>{ppl.nama || "-"}</TableCell>
                                      <TableCell>{ppl.no_telepon || "-"}</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={2} className="text-center">
                                      Tidak ada PPL
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </CollapsibleContent>
                        </Collapsible>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada data yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};
