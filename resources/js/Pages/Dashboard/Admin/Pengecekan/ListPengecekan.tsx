// resources/js/Pages/Dashboard/Admin/Pengecekan/Index.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Head, usePage }                from '@inertiajs/react';
import DashboardLayout                  from '@/Layouts/DashboardLayout';
import { DataTable }                    from '@/Components/Dashboard/Components/DataTable/DataTable';
import { Card, CardHeader, CardContent }from '@/Components/ui/card';
import { Button }                       from '@/Components/ui/button';
import { Copy }                         from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/Components/ui/select';
import type { PageProps, Sampel, Pengecekan } from '@/types';
import { generateColumns }              from '@/Components/Dashboard/Components/DataTable/Components/Columns';
import type { ColumnDef }               from '@tanstack/react-table';
import { toast }                        from 'react-toastify';

type Props = PageProps & {
  samplesUtama:    Array<Sampel & { pengecekan?: Pengecekan }>;
  samplesCadangan: Array<Sampel & { pengecekan?: Pengecekan }>;
};

export default function PengecekanPage() {
  const { samplesUtama = [], samplesCadangan = [] } = usePage<Props>().props;

  // keep local state in case want to mutate later
  // state data
  const [mainData,   setMainData]   = useState(samplesUtama);
  const [backupData, setBackupData] = useState(samplesCadangan);
  // state filter 
  const [selectedYear, setSelectedYear]           = useState<string>('');
  const [selectedSubround, setSelectedSubround]   = useState<string>('');


  useEffect(() => { setMainData(samplesUtama); },   [samplesUtama]);
  useEffect(() => { setBackupData(samplesCadangan); }, [samplesCadangan]);

  // map each Sampel → row object
  const makeRows = (
    arr: Array<Sampel & { pengecekan?: Pengecekan }>
  ) =>
    arr.map(s => ({
      id:                   s.id,
      jenis_tanaman:        s.jenis_tanaman,
      tahun_listing:        s.tahun_listing,
      subround:             s.subround,
      nama_kec:             s.kecamatan?.nama_kecamatan ?? '-',
      nama_lok:             s.nama_lok,
      segmen_id:            s.segmen_id,
      nama_krt:             s.nama_krt,
      rilis:                s.rilis,
      nks:                  s.nks,
      tanggal_pengecekan:   s.pengecekan?.tanggal_pengecekan ?? '-',
      nama_responden:       s.pengecekan?.nama_responden     ?? '-',
      no_telepon_responden: s.pengecekan?.no_telepon_responden ?? '-',
      tanggal_panen:        s.pengecekan?.tanggal_panen      ?? '-',
      keterangan:           s.pengecekan?.keterangan          ?? '-',
      status_sampel:        s.pengecekan?.status_sampel      ?? 'Belum',
      pcl_nama:             s.pcl?.nama,
      pml_nama:             s.tim?.pml?.nama,
    }));

  const rowsMain   = useMemo(() => makeRows(mainData),   [mainData]);
  const rowsBackup = useMemo(() => makeRows(backupData), [backupData]);

    // ambil semua tahun yg muncul
  const yearOptions = useMemo(() => {
      const ys = new Set<string>();
      rowsMain.forEach(r => ys.add(String(r.tahun_listing)));
      return Array.from(ys).sort();
    }, [rowsMain]);
  
    // bangun subroundOptions per tahun
    const subroundOptionsMap = useMemo(() => {
      const map: Record<string, Set<string>> = {};
      rowsMain.forEach(r => {
        const y = String(r.tahun_listing);
        map[y] = map[y]||new Set();
        map[y].add(String(r.subround));
      });
      return Object.fromEntries(
        Object.entries(map)
              .map(([y, set]) => [y, Array.from(set).sort()])
      ) as Record<string,string[]>;
    }, [rowsMain]);
  
    // baris yg sudah difilter
    const filteredRows = useMemo(() => {
      return rowsMain
        .filter(r => !selectedYear || String(r.tahun_listing) === selectedYear)
        .filter(r => !selectedSubround || String(r.subround) === selectedSubround);
    }, [rowsMain, selectedYear, selectedSubround]);

  // full columnTitleMap as requested
  const columnTitleMap: Record<string,string> = {
    id:                   'ID',
    pcl_nama:             'PCL Bertugas',
    pml_nama:             'PML Bertugas',
    jenis_tanaman:        'Jenis Tanaman',
    tahun_listing:        'Tahun Listing',
    subround:             'Subround',
    nama_kec:             'Nama Kecamatan',
    nama_lok:             'Nama Lokasi',
    segmen_id:            'ID Segmen',
    nama_krt:             'Nama KRT',
    rilis:                'Rilis',
    nks:                  'NKS',
    tanggal_pengecekan:   'Tanggal Pengecekan',
    nama_responden:       'Responden',
    no_telepon_responden: 'No. Telepon',
    tanggal_panen:        'Tanggal Panen',
    keterangan:           'Keterangan',
    status_sampel:        'Status Sampel',
  };

  // copy-to-clipboard handler
  const handleCopy = (row: typeof rowsMain[0]) => {
    const { id, ...rest } = row;
    toast.promise(
      navigator.clipboard.writeText(JSON.stringify(rest, null, 2)),
      {
        pending: 'Menyalin baris ke clipboard…',
        success: 'Berhasil disalin!',
        error:   'Gagal menyalin.',
      }
    );
  };

  // generate base columns + add "Copy" action
  const baseColumnsMain: ColumnDef<typeof rowsMain[0]>[] =
    generateColumns<typeof rowsMain[0]>(
      'adminPengecekanMain',
      columnTitleMap,
      undefined,   // no customRender needed
      undefined,   // no detail action
      undefined,   // no update status action
      undefined,   // no edit
      handleCopy,  // copy
      undefined    // no delete
    );

  const baseColumnsBackup: ColumnDef<typeof rowsBackup[0]>[] =
    generateColumns<typeof rowsBackup[0]>(
      'adminPengecekanBackup',
      columnTitleMap,
      undefined,
      undefined,
      undefined,
      undefined,
      handleCopy,
      undefined
    );

  return (
    <DashboardLayout>
      <Head title="Pengecekan Admin" />

      <Card className="mb-6">
      <CardHeader className="flex items-center justify-between space-x-4">
          <div className="flex space-x-2">
            {/* Tahun */}
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectContent>
                {yearOptions.map(y => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Subround (disabled sampai tahun dipilih) */}
            <Select
              value={selectedSubround}
              onValueChange={setSelectedSubround}
              disabled={!selectedYear}
            >
              <SelectContent>
                {(subroundOptionsMap[selectedYear]||[]).map(sr => (
                  <SelectItem key={sr} value={sr}>{sr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <h2 className="text-lg font-semibold">Sampel Utama</h2>
        </CardHeader>
        <CardContent>
          <DataTable
            name="Sampel Utama"
            data={rowsMain}
            columns={baseColumnsMain}
            columnTitleMap={columnTitleMap}
          />
        </CardContent>
      </Card>

      <Card className='mb-6'>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Sampel Cadangan
          </h2>
        </CardHeader>
        <CardContent>
          <DataTable
            name="Sampel Cadangan"
            data={rowsBackup}
            columns={baseColumnsBackup}
            columnTitleMap={columnTitleMap}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
