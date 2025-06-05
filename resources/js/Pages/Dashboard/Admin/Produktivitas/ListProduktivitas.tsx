// resources/js/Pages/Dashboard/Admin/Produktivitas/ListProduktivitas.tsx

import React, { useState, useMemo } from 'react';
import { Head, usePage }                  from '@inertiajs/react';
import DashboardLayout                    from '@/Layouts/DashboardLayout';
import { DataTable }                      from '@/Components/Dashboard/Components/DataTable/DataTable';
import { Card, CardHeader, CardContent }  from '@/Components/ui/card';
import { toast }                          from 'react-toastify';
import { generateColumns }                from '@/Components/Dashboard/Components/DataTable/Components/Columns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import type { ColumnDef }                 from '@tanstack/react-table';
import type { PageProps }                 from '@/types';

// Record per sampel
type SampelRecord = {
  id_hasil_ubinan:   number;
  tanggal_ubinan:    string | null;
  nama_lok:          string | null;
  konversi:          number;
  jumlah_luas_ubinan:number;
  berat_hasil_ubinan:number | null;
  produktivitas:     number | null;
};

// Record per kecamatan
type KecamatanRecord = {
  tahun_listing:  string;
  subround:       string;
  kecamatan:      string;
  produktivitas:  number;
};

// Record per kabupaten
type KabupatenRecord = {
  tahun_listing:  string;
  subround:       string;
  kabupaten:      string;
  produktivitas:  number;
};

type Props = PageProps & {
  records: SampelRecord[];
  byKecamatan: KecamatanRecord[];
  byKabupaten: KabupatenRecord[];
};

export default function ListProduktivitas() {
  const {
    records = [],
    byKecamatan = [],
    byKabupaten = [],
  } = usePage<Props>().props;

  const [viewMode, setViewMode] = useState<'sampel' | 'kecamatan' | 'kabupaten'>('sampel');

  // Unified copy handler
  const handleCopy = (row: any) => {
    const payload = { ...row };
    delete payload.id_hasil_ubinan;
    toast.promise(
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2)),
      { pending: 'Menyalin data…', success: 'Berhasil disalin!', error: 'Gagal menyalin.' }
    );
  };

  // Column title maps
  const sampelTitleMap = useMemo(() => ({
    id_hasil_ubinan:    'ID Hasil Ubinan',
    tanggal_ubinan:     'Tanggal Ubinan',
    kecamatan_id:      'ID Kecamatan',
    nama_kecamatan:    'Kecamatan',
    nama_lok:           'Lokasi Sampel',
    konversi:           'Konversi',
    jumlah_luas_ubinan: 'Luas Ubinan (m²)',
    berat_hasil_ubinan: 'Berat Ubinan (kg)',
    produktivitas:      'Produktivitas (kw/ha)',
  }), []);

  const kecamatanTitleMap = useMemo(() => ({
    tahun_listing:  'Tahun',
    subround:       'Subround',
    kecamatan_id:   'ID Kecamatan',
    kecamatan:      'Kecamatan',
    jumlah_sampel: 'Jumlah Sampel',
    rata2_berat: 'Rata-rata Berat (kg)',
    produktivitas:  'Produktivitas (kw/ha)',
  }), []);

  const kabupatenTitleMap = useMemo(() => ({
    tahun_listing:  'Tahun',
    subround:       'Subround',
    kabupaten_id: 'Kode Kab/Kota',
    kabupaten:      'Kabupaten',
    jumlah_sampel: 'Jumlah Sampel',
    rata2_berat: 'Rata-rata Berat (kg)',
    produktivitas:  'Produktivitas (kw/ha)',
  }), []);

  // Generate columns
  const columnsSampel: ColumnDef<SampelRecord>[] = useMemo(
    () => generateColumns<SampelRecord>(
      'produktivitassAdmin',
      sampelTitleMap,
      undefined,
      undefined,
      undefined,
      undefined,
      handleCopy,
      undefined
    ), [sampelTitleMap]
  );

  const columnsKecamatan: ColumnDef<KecamatanRecord>[] = useMemo(
    () => generateColumns<KecamatanRecord>(
      'produktivitaskecamatanAdmin',
      kecamatanTitleMap,
      undefined,
      undefined,
      undefined,
      undefined,
      handleCopy,
      undefined
    ), [kecamatanTitleMap]
  );

  const columnsKabupaten: ColumnDef<KabupatenRecord>[] = useMemo(
    () => generateColumns<KabupatenRecord>(
      'produktivitaskabupatenAdmin',
      kabupatenTitleMap,
      undefined,
      undefined,
      undefined,
      undefined,
      handleCopy,
      undefined
    ), [kabupatenTitleMap]
  );

  // Default cell for nulls
  [...columnsSampel, ...columnsKecamatan, ...columnsKabupaten].forEach(col => {
    if (!col.cell) {
      col.cell = ({ row }: { row: any }) => {
        const key = (col as any).accessorKey as string;
        const value = row.getValue(key);
        return value != null ? String(value) : '—';
      };
    }
  });

  return (
    <DashboardLayout>
      <Head title="Daftar Produktivitas" />

      <Card>
        <CardHeader>
          <h2 className="text-base sm:text-xl font-semibold text-center">Daftar Produktivitas</h2>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as 'sampel' | 'kecamatan' | 'kabupaten')}>
            <TabsList>
              <TabsTrigger value="sampel">Sampel</TabsTrigger>
              <TabsTrigger value="kecamatan">Kecamatan</TabsTrigger>
              <TabsTrigger value="kabupaten">Kabupaten</TabsTrigger>
            </TabsList>

            <TabsContent value="sampel">
              <DataTable
                name="ProduktivitasSampel"
                data={records}
                columns={columnsSampel}
                columnTitleMap={sampelTitleMap}
              />
            </TabsContent>

            <TabsContent value="kecamatan">
              <DataTable
                name="ProduktivitasKecamatan"
                data={byKecamatan}
                columns={columnsKecamatan}
                columnTitleMap={kecamatanTitleMap}
              />
            </TabsContent>

            <TabsContent value="kabupaten">
              <DataTable
                name="ProduktivitasKabupaten"
                data={byKabupaten}
                columns={columnsKabupaten}
                columnTitleMap={kabupatenTitleMap}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
