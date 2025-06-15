import React from "react";
import { DataTable } from "@/Components/Dashboard/Components/DataTable/DataTable";
import { Kecamatan } from "@/types";

const columnTitleMap: Record<string, string> = {
  id: "Kode Kecamatan",
  nama_kecamatan: "Nama Kecamatan",
};

interface KecamatanSectionProps {
  kecData: Kecamatan[];
}

const KecamatanSection: React.FC<KecamatanSectionProps> = ({ kecData }) => {
  const columns = [
    { accessorKey: "id", header: "Kode Kecamatan" },
    { accessorKey: "nama_kecamatan", header: "Nama Kecamatan" },
  ];
  return (
    <DataTable
      data={kecData}
      columns={columns}
      name="kecamatan"
      columnTitleMap={columnTitleMap}
    />
  );
};

export default KecamatanSection;
