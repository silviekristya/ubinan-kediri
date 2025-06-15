import React from "react";
import { DataTable } from "@/Components/Dashboard/Components/DataTable/DataTable";
import { KabKota } from "@/types";

const columnTitleMap: Record<string, string> = {
  id: "Kode Kab/Kota",
  nama_kab_kota: "Nama Kab/Kota",
};

interface KabKotaSectionProps {
  kabKotaData: KabKota[];
}

const KabKotaSection: React.FC<KabKotaSectionProps> = ({ kabKotaData }) => {
  const columns = [
    { accessorKey: "id", header: "Kode Kab/Kota" },
    { accessorKey: "nama_kab_kota", header: "Nama Kab/Kota" },
  ];
  return (
    <DataTable
      data={kabKotaData}
      columns={columns}
      name="kabkota"
      columnTitleMap={columnTitleMap}
    />
  );
};

export default KabKotaSection;
