import React from "react";
import { DataTable } from "@/Components/Dashboard/Components/DataTable/DataTable";
import { Provinsi } from "@/types";

const columnTitleMap: Record<string, string> = {
  kode_provinsi: "Kode Provinsi",
  nama_provinsi: "Nama Provinsi",
};

interface ProvinsiSectionProps {
  provData: Provinsi[];
}

const ProvinsiSection: React.FC<ProvinsiSectionProps> = ({ provData }) => {
  const columns = [
    { accessorKey: "kode_provinsi", header: "Kode Provinsi" },
    { accessorKey: "nama_provinsi", header: "Nama Provinsi" },
  ];
  return (
    <DataTable
      data={provData}
      columns={columns}
      name="provinsi"
      columnTitleMap={columnTitleMap}
    />
  );
};

export default ProvinsiSection;
