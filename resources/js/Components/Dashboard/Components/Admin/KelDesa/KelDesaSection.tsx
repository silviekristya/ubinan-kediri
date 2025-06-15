import React from "react";
import { DataTable } from "@/Components/Dashboard/Components/DataTable/DataTable";
import { KelurahanDesa } from "@/types";

const columnTitleMap: Record<string, string> = {
  id: "Kode Kel/Desa",
  nama_kel_desa: "Nama Kelurahan/Desa",
};

interface KelDesaSectionProps {
  kelData: KelurahanDesa[];
}

const KelDesaSection: React.FC<KelDesaSectionProps> = ({ kelData }) => {
  const columns = [
    { accessorKey: "id", header: "Kode Kel/Desa" },
    { accessorKey: "nama_kel_desa", header: "Nama Kelurahan/Desa" },
  ];
  return (
    <DataTable
      data={kelData}
      columns={columns}
      name="keldesa"
      columnTitleMap={columnTitleMap}
    />
  );
};

export default KelDesaSection;
