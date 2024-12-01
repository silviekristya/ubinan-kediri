"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { DataTableViewOptions } from "@/Components/Dashboard/Components/DataTable/Components/DataTableViewOptions"

import { roleUsers } from "@/Components/Dashboard/Components/Admin/User/DataTableFilterUser"
import { DataTableFacetedFilter } from "@/Components/Dashboard/Components/DataTable/Components/DataTableFacetedFilter"
import { downloadToExcel } from "@/lib/xlsxDownload"

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  columnTitleMap: { [key: string]: string };
  data: TData[];
  name: string;
}

export function DataTableToolbar<TData>({
  table,
  columnTitleMap,
  data,
  name,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const rowSelection = table.getState().rowSelection;
  const columns = table.getAllColumns(); // Ambil kolom dari tabel

  const filteredData = table.getFilteredRowModel().rows.map(row => row.original);

  // Ambil semua baris terpilih dari seluruh halaman
  const selectedRows = Object.keys(rowSelection).length > 0
    ? table.getPreFilteredRowModel().rows.filter(row => rowSelection[row.id]).map(row => row.original)
    : null; // Jika tidak ada yang dipilih, set null

  const handleDownload = () => {
    // Gunakan data yang difilter jika tidak ada baris yang dipilih
    const rowsToExport = selectedRows || filteredData;

    const modifiedRows = (rowsToExport as (TData)[]).map(row => {
      return {
        ...row,
      };
    });

    const visibleColumns = columns
      .filter(col => col.getIsVisible() && col.id !== 'id' && col.id !== 'userId' && col.id !== 'select' && col.id !== 'abstract' && col.id !== 'actions')
      .map(col => col.id as string);

      downloadToExcel(
        modifiedRows,
        columns.filter(col => col.id !== 'id' && col.id !== 'select' && col.id !== 'abstract' && col.id !== 'actions'), // Filter kolom 'select' dan 'actions'
        visibleColumns,
        columnTitleMap,
        selectedRows,
        name
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Cari..."
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Button onClick={handleDownload}>
          Download Excel
        </Button>

        {/* Filter Tabel User */}
        {name === "User" && table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={roleUsers}
          />
        )}
        {/* Filter Tabel User */}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} columnTitleMap={columnTitleMap} />
    </div>
  )
}
