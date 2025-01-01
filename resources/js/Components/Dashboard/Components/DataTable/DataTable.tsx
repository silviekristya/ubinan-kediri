import * as React from "react"
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
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"

import { DataTablePagination } from "@/Components/Dashboard/Components/DataTable/Components/DataTablePagination"
import { DataTableToolbar } from "@/Components/Dashboard/Components/DataTable/Components/DataTableToolbar"

interface DataTableProps {
  data: any[]
  columns: ColumnDef<any>[]
  columnTitleMap: { [key: string]: string },
  name: string
}

export const DataTable = ({
  data,
  columns,
  columnTitleMap,
  name,
}: DataTableProps) => {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

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
  })

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
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="text-xs md:text-sm">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
                            left: cell.column.id === 'actions' ? 0 : cell.column.id === 'select' ? '47px' : 'auto', // Atur posisi left
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
