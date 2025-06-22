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
import { useIsMobile } from "@/hooks/useIsMobile";

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

  const isMobile = useIsMobile();
  const mainColumnCount = isMobile ? 4 : columns.length;
  const [expandedRows, setExpandedRows] = React.useState<{ [rowId: string]: boolean }>({});
  const toggleRow = (rowId: string) => {
    setExpandedRows(prev => ({ ...prev, [rowId]: !prev[rowId] }));
  };
  const hasActions = columns.some(col => col.id === "actions");
  return (
    <div className="space-y-4 w-full overflow-x-auto p-2">
      <DataTableToolbar table={table} columnTitleMap={columnTitleMap} name={name} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {isMobile ? (
                  // Expanded column di KIRI, lalu mainColumnCount kolom utama
                  <>
                    {headerGroup.headers.length > mainColumnCount && (
                      <TableHead key="expand-head" className="w-10 text-center"></TableHead>
                    )}
                    {headerGroup.headers.slice(0, mainColumnCount).map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </>
                ) : (
                  // Desktop: semua kolom
                  headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={
                        header.id === 'actions'
                          ? 'w-10 max-w-[64px] text-center'
                          : header.id === 'select'
                          ? hasActions
                            ? 'w-10 max-w-[64px] text-center'
                            : 'w-[32px] max-w-[40px] text-center'
                          : ''
                      }
                      style={{
                        position: header.id === 'actions' || header.id === 'select' ? 'sticky' : 'static',
                        left: header.id === 'actions' ? 0 : header.id === 'select'
                          ? hasActions ? '47px' : '0px'
                          : 'auto',
                        zIndex: 2,
                        background: 'white',
                        borderRight: '1px solid #e5e7eb',
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="text-xs md:text-sm">
            {isMobile ? (
              table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => {
                  const visibleCells = row.getVisibleCells();
                  const mainCells = visibleCells.slice(0, mainColumnCount);
                  const hiddenCells = visibleCells.slice(mainColumnCount);

                  return (
                    <React.Fragment key={row.id}>
                      <TableRow data-state={row.getIsSelected() && "selected"}>
                        {hiddenCells.length > 0 && (
                          <TableCell
                            key="expand"
                            className="w-10 text-center cursor-pointer"
                            onClick={() => toggleRow(row.id)}
                          >
                            {/* <span>{expandedRows[row.id] ? "▲" : "▼"}</span> */}
                            <span
                              className={
                                "inline-block transition-transform duration-200 font-bold" +
                                (expandedRows[row.id] ? " rotate-180 text-black" : " text-gray-400 hover:text-black")
                              }
                            >
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}    // lebih tebal
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </span>
                          </TableCell>
                        )}
                        {mainCells.map(cell => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                      {expandedRows[row.id] && (
                        <TableRow className="bg-gray-50">
                          <TableCell colSpan={mainColumnCount + 1}>
                            <div className="space-y-2">
                              {hiddenCells.map(cell => {
                                const header = table.getLeafHeaders().find(h => h.column.id === cell.column.id);
                                return (
                                  <div key={cell.id} className="flex">
                                    <span className="font-semibold min-w-[160px] flex justify-start mr-2 border-r-2">
                                      {columnTitleMap[cell.column.id] || cell.column.id}
                                    </span>
                                    <span>
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={mainColumnCount + 1} className="h-24 text-center">
                    Tidak ada data yang ditemukan.
                  </TableCell>
                </TableRow>
              )
            ) : (
              // DESKTOP/DEFAULT
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === 'actions'
                            ? 'w-10 max-w-[64px] text-center'
                            : cell.column.id === 'select'
                            ? hasActions
                              ? 'w-10 max-w-[64px] text-center'
                              : 'w-[32px] max-w-[40px] text-center'
                            : ''
                        }
                        style={{
                          position: cell.column.id === 'actions' || cell.column.id === 'select' ? 'sticky' : 'static',
                          left: cell.column.id === 'actions' ? 0 : cell.column.id === 'select'
                          ? hasActions ? '47px' : '0px'
                          : 'auto',
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
              )
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
