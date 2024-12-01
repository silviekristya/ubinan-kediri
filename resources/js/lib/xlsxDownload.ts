import xlsx, { IJsonSheet } from 'json-as-xlsx';
import { ColumnDef } from '@tanstack/react-table';

export function downloadToExcel<TData>(
  data: TData[],
  columns: ColumnDef<TData, any>[],
  selectedColumns: string[],
  columnTitleMap: { [key: string]: string },
  selectedRows: TData[] | null,
  fileName: string
) {
  // Filter data to only include selected rows if any, otherwise include all rows
  const rowsToDownload = selectedRows || data;

  // Filter data to only include selected columns
  const filteredData = rowsToDownload.map(row => {
    const filteredRow: { [key: string]: any } = {};
    selectedColumns.forEach(col => {
      filteredRow[col] = (row as any)[col];
    });
    return filteredRow;
  });

  // Create the column headers for the Excel sheet based on the selected columns and columnTitleMap
  const excelColumns = selectedColumns.map(col => {
    const columnDef = columns.find(c => c.id === col); // Use id instead of accessorKey
    return {
      label: columnTitleMap[col] || col,
      value: col
    };
  });

  const excelSheet: IJsonSheet = {
    sheet: fileName,
    columns: excelColumns,
    content: filteredData
  };

  const settings = {
    fileName: fileName,
  };

  xlsx([excelSheet], settings);
}
