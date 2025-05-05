"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { DataTableViewOptions } from "@/Components/Dashboard/Components/DataTable/Components/DataTableViewOptions"

import {tahunOptions, subroundOptions as allSubroundOptions} from "@/Components/Dashboard/Components/Admin/Pengecekan/DataTableFilterPengecekan"; // Ensure this path is correct or adjust it
import { rolePegawai } from "@/Components/Dashboard/Components/Admin/Pegawai/DataTableFilterPegawai";
import { DataTableFacetedFilter } from "@/Components/Dashboard/Components/DataTable/Components/DataTableFacetedFilter"
import { downloadToExcel } from "@/lib/xlsxDownload"
import { Download } from 'lucide-react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  columnTitleMap: { [key: string]: string };
  name: string;
}

export function DataTableToolbar<TData>({
  table,
  columnTitleMap,
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

  // Ambil tahun yang difilter
  const selectedYear = table
    .getState()
    .columnFilters
    .find(f => f.id === "tahun_listing")
    ?.value as string | undefined

  // Ambil semua tahun yg muncul
  const yearCol = columns.find(col => col.id === 'tahun_listing')
  const yearOptions =
    yearCol
      ? tahunOptions(
        Array.from(yearCol.getFacetedUniqueValues().keys()) as string[]
      )
      : []

  // Ambil semua subround yg muncul
  const subroundCol = columns.find(col => col.id === 'subround')
  const subroundOptionsMap: Record<string, { value: string; label: string }[]> = {}  
   if (subroundCol) {  
     yearOptions.forEach(({ value: year }) => {  
       // only subrounds in that year  
       const opts = Array.from(subroundCol.getFacetedUniqueValues().keys())  
         .filter((sr) =>  
           table  
             .getPreFilteredRowModel()  
             .rows  
             .some((r) =>  
               (r.original as any).tahun_listing === year &&  
               (r.original as any).subround === sr  
             )  
         );
       subroundOptionsMap[year] = allSubroundOptions(opts);
     })  
   }  

   // Ambil sobround yang dipilih
   const subroundOptions = 
    selectedYear && subroundOptionsMap[selectedYear] 
    ? subroundOptionsMap[selectedYear] 
    : []

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Cari..."
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Button onClick={handleDownload} className="gap-1 flex items-center justify-center">
            <Download className="h-4 w-4"/>
            Excel
        </Button>

        {/* Filter Tabel User */}
        {name === "Pegawai" && table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={rolePegawai}
          />
        )}
        {/* Filter Tabel User */}

        {/* Filter Tabel Pengecekan */}
        {(name === "Sampel Utama" || name === "Sampel Cadangan" || name === "Sampel" || name === "Hasil Ubinan Admin") && yearCol && (
          <DataTableFacetedFilter
            column={yearCol!}
            title="Tahun"
            options={yearOptions}
          />
        )}
        {(name === "Sampel Utama" || name=== "Sampel Cadangan" || name === "Sampel" || name === "Hasil Ubinan Admin") && subroundCol && (
        <div
        className={`relative ${
          !selectedYear
            ? "pointer-events-none opacity-50"
            : ""
        }`}
        >
          <DataTableFacetedFilter
          column={subroundCol}
          title="Subround"
          options={subroundOptions}
          />
          { !selectedYear && (
            <div className="absolute inset-0" aria-hidden="true" />
          ) }
        </div>
        )}
        {/* Filter Tabel Pengecekan */}

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
