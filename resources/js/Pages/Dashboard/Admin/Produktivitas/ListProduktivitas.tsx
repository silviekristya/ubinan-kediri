import React, { useState, useEffect, useMemo } from 'react';
import { Head, usePage }                  from '@inertiajs/react';
import DashboardLayout                    from '@/Layouts/DashboardLayout';
import { DataTable }                      from '@/Components/Dashboard/Components/DataTable/DataTable';
import { Card, CardHeader, CardContent }  from '@/Components/ui/card';
import { Button }                         from '@/Components/ui/button';
import { Copy }                           from 'lucide-react';
import { toast }                          from 'react-toastify';
import { generateColumns }                from '@/Components/Dashboard/Components/DataTable/Components/Columns';
import type { ColumnDef }                 from '@tanstack/react-table';
import type { PageProps }                 from '@/types';

interface RecordType {
  id_hasil_ubinan:   number;
  luas_perhektar:    number;
  jumlah_luas_ubinan:number;
  berat_hasil_ubinan:number | null;
  produktivitas:     number | null;
//   created_at:        string;
//   updated_at:        string;
}

type Props = PageProps & {
  records: RecordType[];
};

export default function ListProduktivitas() {
  // ambil data dari server
  const { records = [] } = usePage<Props>().props;

  // local state mirror
  const [data, setData] = useState<RecordType[]>(records);
  useEffect(() => { setData(records); }, [records]);

  // transform data → row (bisa dipakai customRender nanti)
  const rows = useMemo(
    () => data.map(r => ({
      ...r,
      // jika mau override format tanggal nanti bisa customRender
    })),
    [data]
  );

  // judul kolom
  const columnTitleMap: Record<string,string> = {
    id_hasil_ubinan:    'ID Hasil Ubinan',
    luas_perhektar:     'Luas per Ha (m²)',
    jumlah_luas_ubinan: 'Luas Ubinan (m²)',
    berat_hasil_ubinan: 'Berat Hasil Ubinan',
    produktivitas:      'Produktivitas',
    // created_at:         'Dibuat',
    // updated_at:         'Diubah',
  };

  // 5) copy‐to‐clipboard action
  const handleCopy = (row: RecordType) => {
    const { id_hasil_ubinan, ...rest } = row;
    toast.promise(
      navigator.clipboard.writeText(JSON.stringify(rest, null, 2)),
      {
        pending: 'Menyalin data…',
        success: 'Berhasil disalin!',
        error:   'Gagal menyalin.',
      }
    );
  };

  // 6) generate base columns + opsi copy
  const columns: ColumnDef<RecordType>[] =
    generateColumns<RecordType>(
      'produkvitiasAdmin',
      columnTitleMap,
      undefined,      // no customRender
      undefined,      // no detail
      undefined,      // no updateStatus
      undefined,      // no edit
      handleCopy,     // onCopy
      undefined       // no delete
    );

    const beratColIndex = columns.findIndex(c => (c as any).accessorKey === 'berat_hasil_ubinan');
    if (beratColIndex >= 0) {
    columns[beratColIndex] = {
        ...columns[beratColIndex],
        cell: ({ row }) => String(row.getValue('berat_hasil_ubinan') ?? '—'),
    };
    }

  // render
  return (
    <DashboardLayout>
      <Head title="Daftar Produktivitas" />

      <Card className="mb-6">
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Daftar Produktivitas</h2>
        </CardHeader>
        <CardContent>
          <DataTable
            name="Produktivitas"
            data={rows}
            columns={columns}
            columnTitleMap={columnTitleMap}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
